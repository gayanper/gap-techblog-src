#!/bin/sh

function remove_elements() {
    # make sure the delete the file if exist on disk
    if [ -f $2 ]; then
        rm -f $2
    fi

    cat $1 \
        | yq eval 'del(.. | select(has("tags")).tags[])' \
        | yq eval 'del(.. | select(has("examples")).examples[])' \
        | yq eval 'del(.. | select(has("extensions")).extensions[])' \
        | yq eval 'del(.. | select(has("description")).description)' \
        | yq eval 'del(.. | select(has("title")).title)' \
        | yq eval 'del(.. | select(has("summary")).summary)' \
        | yq eval 'del(.. | select(has("endpoints")).endpoints)' \
        | yq eval 'del(.. | select(has("info")).info)' \
        | yq eval 'del(.. | select(has("openapi")).openapi)' \
        > $2
}

# check if we have the right java version (23) set as default
java --version | grep -q "(build 22"
if [ $? -ne 0 ]; then
  echo "Java version is not 22"
  exit 1
fi

# start the springboot app from the jar
java -jar ./build/libs/drug-catalog-0.0.1-SNAPSHOT.jar &
appPid=$!
# wait for port 8080 to be available
count=0
while ! nc -z localhost 8080; do
    count=$((count+1))
    if [ $count -gt 10 ]; then
        echo "Port 8080 not listening after 5 seconds"
        exit 1
    else
        sleep 1
    fi
done

spec_path=$(realpath '../specifications/drug-catalog-spec.yaml')
spec_file_path=$(mktemp)

# remove the unwanted elements from the the yaml content and dump to tmp file   
remove_elements $spec_path $spec_file_path

api_file=$(mktemp)
api_file_path=$(mktemp)

curl -s http://localhost:8080/v3/api-docs.yaml > $api_file
# remove the unwanted elements from the the yaml content and dump to tmp file   
remove_elements $api_file $api_file_path

# stop the springboot app
kill $appPid

echo
echo 
echo "Running oasdiff ..."
echo
echo

# run the oas diff tool
docker run --rm -t -v $spec_file_path:/var/spec-file.yaml \
    -v $api_file_path:/var/service-file.yaml \
    tufin/oasdiff diff -o \
    /var/spec-file.yaml  /var/service-file.yaml >> /dev/null # we don't want the output

oas_status=$?

if [ $oas_status -ne 0 ]; then
    docker run --rm -t -v $spec_file_path:/var/spec-file.yaml \
        -v $api_file_path:/var/service-file.yaml \
        tufin/oasdiff changelog \
        /var/spec-file.yaml  /var/service-file.yaml
fi

exit $oas_status