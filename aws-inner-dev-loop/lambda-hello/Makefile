build:
	cd ./HelloWorldFunction; ./gradlew build;

run-local: build
	cd ./cdk; cdk synth; sam local start-api -t ./cdk.out/hello-api-stack.template.json --region eu-north-1

debug-local: build
	cd ./cdk; cdk synth; sam local start-api -t ./cdk.out/hello-api-stack.template.json --region eu-north-1 -d 5858

debug-local-lambda-only: build
	cd ./cdk; cdk synth; sam local invoke -t ./cdk.out/hello-api-stack.template.json --region eu-north-1 -d 5858 HelloLambda

deploy: build
	cd ./cdk; cdk deploy;

undeploy:
	cd ./cdk; cdk destroy;