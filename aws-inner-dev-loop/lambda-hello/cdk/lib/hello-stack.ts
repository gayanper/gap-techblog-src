import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class HelloStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const helloLambdaFunction = new cdk.aws_lambda.Function(this, 'HelloLambda', {
      runtime: cdk.aws_lambda.Runtime.JAVA_21,
      handler: 'helloworld.Hello::handleRequest',
      code: cdk.aws_lambda.Code.fromAsset('../HelloWorldFunction/build/distributions/HelloWorldFunction.zip'),
      architecture: cdk.aws_lambda.Architecture.X86_64,
      memorySize: 512,
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      tracing: cdk.aws_lambda.Tracing.ACTIVE,
      insightsVersion: cdk.aws_lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
    });


    const apiGatewayRestApi = new cdk.aws_apigateway.RestApi(this, 'HelloApi', {
      restApiName: 'Hello API',
      description: 'An example API for a hello lambda function',
    });

    const helloIntegration = new cdk.aws_apigateway.LambdaIntegration(helloLambdaFunction);
    apiGatewayRestApi.root.resourceForPath('/hello').addMethod('GET', helloIntegration);
  }
}
