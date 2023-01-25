import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, BillingMode, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Tracing, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

const commonProps: Partial<NodejsFunctionProps> = {
  runtime: Runtime.NODEJS_18_X,
  tracing: Tracing.ACTIVE,
  timeout: Duration.seconds(30),
  logRetention: RetentionDays.ONE_DAY,
  environment: {
    NODE_OPTIONS: '--enable-source-maps', // see https://docs.aws.amazon.com/lambda/latest/dg/typescript-exceptions.html
    POWERTOOLS_SERVICE_NAME: 'items-store',
    POWERTOOLS_METRICS_NAMESPACE: 'PowertoolsCDKExample',
    LOG_LEVEL: 'DEBUG'
  },
  bundling: {
    externalModules: [
      '@aws-sdk/lib-dynamodb',
      '@aws-sdk/client-dynamodb',
      '@aws-lambda-powertools/commons',
      '@aws-lambda-powertools/logger',
      '@aws-lambda-powertools/tracer',
      '@aws-lambda-powertools/metrics',
    ],
  },
  layers: [],
};

export class CdkAppStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'Table', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        type: AttributeType.STRING,
        name: 'id',
      }
    });

    commonProps.layers?.push(
      LayerVersion.fromLayerVersionArn(
        this,
        'powertools-layer',
        `arn:aws:lambda:${Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:6`)
    );

    const putItemFn = new NodejsFunction(this, 'put-item-fn', {
      ...commonProps,
      entry: './functions/put-item.ts',
      handler: 'handler',
    });
    putItemFn.addEnvironment('SAMPLE_TABLE', table.tableName);
    table.grantWriteData(putItemFn);

    const getAllItemsFn = new NodejsFunction(this, 'get-all-items-fn', {
      ...commonProps,
      entry: './functions/get-all-items.ts',
      handler: 'handler',
    });
    getAllItemsFn.addEnvironment('SAMPLE_TABLE', table.tableName);
    table.grantReadData(getAllItemsFn);

    const getByIdFn = new NodejsFunction(this, 'get-by-id-fn', {
      ...commonProps,
      entry: './functions/get-by-id.ts',
      handler: 'handler',
    });
    getByIdFn.addEnvironment('SAMPLE_TABLE', table.tableName);
    table.grantReadData(getByIdFn);

    const api = new RestApi(this, 'items-api', {
      restApiName: 'Items Service',
      description: 'This service serves items.',
    });

    const itemPutIntegration = new LambdaIntegration(putItemFn);
    api.root.addMethod('POST', itemPutIntegration);

    const itemsIntegration = new LambdaIntegration(getAllItemsFn);
    api.root.addMethod('GET', itemsIntegration);

    const item = api.root.addResource('{id}');
    const itemIntegration = new LambdaIntegration(getByIdFn);
    item.addMethod('GET', itemIntegration);
  }
}
