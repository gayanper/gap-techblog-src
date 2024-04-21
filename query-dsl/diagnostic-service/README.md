# Diagnostic Service

**Disclaimer** 

> All sample data used in this project and the service are not based on any real-world studies. Everything
> you find here is based on a hypothetical service and hypothetical data set made using ChatGPT to exercise the 
> **"Designing RESTful query DSL"** related to the medium story (Designing RESTful query DSL)[https://medium.com/@gayanper/designing-restful-query-dsl-f6e8bb595e4d].
> The CHatGPT prompt can be found at `src/main/python/prompt.txt`

## Running the service

To run the service, open this folder as a Quarkus project in your favorite IDE, if you are using VSCode all the required
configurations are already in place to open and run this project.

Before running the the project you need to setup data and the database.

### Setting up the database

The service use MongoDB CE edition. You can spin up the database with pre-populate data by running the docker compose
file provided at `compose/docker-compose.yaml`

### Running the service

To run the service, you can either use the quarkus CLI or from VSCode you can execute the debug configuration provided
with the source code.

To check test out the service run the following curl command

```shell
curl --request POST \
  --url http://localhost:8080/diagnosis/search \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.1' \
  --data '{
	"match_any": [
		{
			"equals": {
				"attribute": "code",
				"value": "J10"
			}
		},
		{
			"match_all": [
				{
					"equals": {
						"attribute": "code",
						"value": "J00"
					}
				},
				{
					"equals": {
						"attribute": "gender",
						"value": "F"
					}
				},
				{
					"equals": {
						"attribute": "married",
						"value": false
					}
				},
				{
					"range": {
						"attribute": "ageAtDiagnose",
						"values": [
							{
								"lt": {
									"value": 50
								}
							}
						]
					}
				}
			]
		}
	]
}'
```

## Extra development resources

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

### Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```shell script
./gradlew quarkusDev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

### Packaging and running the application

The application can be packaged using:
```shell script
./gradlew build
```
It produces the `quarkus-run.jar` file in the `build/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `build/quarkus-app/lib/` directory.

The application is now runnable using `java -jar build/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:
```shell script
./gradlew build -Dquarkus.package.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar build/*-runner.jar`.

### Creating a native executable

You can create a native executable using: 
```shell script
./gradlew build -Dquarkus.package.type=native
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: 
```shell script
./gradlew build -Dquarkus.package.type=native -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./build/diagnostic-service-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/gradle-tooling.

### Related Guides

- MongoDB client ([guide](https://quarkus.io/guides/mongodb)): Connect to MongoDB in either imperative or reactive style
- REST ([guide](https://quarkus.io/guides/rest)): A Jakarta REST implementation utilizing build time processing and Vert.x. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it.
