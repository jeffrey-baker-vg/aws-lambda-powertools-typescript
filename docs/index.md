---
title: Homepage
description: AWS Lambda Powertools for TypeScript
---

A suite of utilities for AWS Lambda functions running on the Node.js runtime, to ease adopting best practices such as tracing, structured logging, custom metrics, [**and more**](#features).

You can use Powertools in both TypeScript and JavaScript code bases.

???+ tip
    Powertools is also available for [Python](https://awslabs.github.io/aws-lambda-powertools-python/){target="_blank"}, [Java](https://awslabs.github.io/aws-lambda-powertools-java/){target="_blank"}, and [.NET](https://awslabs.github.io/aws-lambda-powertools-dotnet/){target="_blank"}

??? hint "Support this project by becoming a reference customer, sharing your work, or using Layers :heart:"

    You can choose to support us in three ways:

    1) [**Become a reference customers**](https://github.com/awslabs/aws-lambda-powertools-typescript/issues/new?assignees=&labels=customer-reference&template=support_powertools.yml&title=%5BSupport+Lambda+Powertools%5D%3A+%3Cyour+organization+name%3E). This gives us permission to list your company in our documentation.

    2) [**Share your work**](https://github.com/awslabs/aws-lambda-powertools-typescript/issues/new?assignees=&labels=community-content&template=share_your_work.yml&title=%5BI+Made+This%5D%3A+%3CTITLE%3E). Blog posts, video, sample projects you used Powertools!

    3) Use [**Lambda Layers**](#lambda-layer), if possible. This helps us understand who uses Powertools in a non-intrusive way, and helps us gain future investments for other Lambda Powertools languages.

    When using Layers, you can add Lambda Powertools as a `devDependency` to not impact the development process.

## Install

Powertools is available in the following formats:

* **Lambda Layer**: [**arn:aws:lambda:{region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7**](#){: .copyMe}:clipboard:
* **npm**: **`npm install @aws-lambda-powertools/tracer @aws-lambda-powertools/metrics @aws-lambda-powertools/logger`**

### Lambda Layer

[Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html){target="_blank"} is a .zip file archive that can contain additional code, pre-packaged dependencies, data,  or configuration files. Layers promote code sharing and separation of responsibilities so that you can iterate faster on writing business logic.

You can include Lambda Powertools Lambda Layer using [AWS Lambda Console](https://docs.aws.amazon.com/lambda/latest/dg/invocation-layers.html#invocation-layers-using){target="_blank"}, or your preferred deployment framework.

??? note "Note: Click to expand and copy any regional Lambda Layer ARN"

    | Region           | Layer ARN                                                                                                   |
    | ---------------- | ----------------------------------------------------------------------------------------------------------- |
    | `us-east-1`      | [arn:aws:lambda:us-east-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `us-east-2`      | [arn:aws:lambda:us-east-2:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `us-west-1`      | [arn:aws:lambda:us-west-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `us-west-2`      | [arn:aws:lambda:us-west-2:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `ap-south-1`     | [arn:aws:lambda:ap-south-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:     |
    | `ap-northeast-1` | [arn:aws:lambda:ap-northeast-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard: |
    | `ap-northeast-2` | [arn:aws:lambda:ap-northeast-2:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard: |
    | `ap-northeast-3` | [arn:aws:lambda:ap-northeast-3:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard: |
    | `ap-southeast-1` | [arn:aws:lambda:ap-southeast-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard: |
    | `ap-southeast-2` | [arn:aws:lambda:ap-southeast-2:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard: |
    | `eu-central-1`   | [arn:aws:lambda:eu-central-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:   |
    | `eu-west-1`      | [arn:aws:lambda:eu-west-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `eu-west-2`      | [arn:aws:lambda:eu-west-2:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `eu-west-3`      | [arn:aws:lambda:eu-west-3:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |
    | `eu-north-1`     | [arn:aws:lambda:eu-north-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:     |
    | `ca-central-1`   | [arn:aws:lambda:ca-central-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:   |
    | `sa-east-1`      | [arn:aws:lambda:sa-east-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:7](#){: .copyMe}:clipboard:      |

??? note "Note: Click to expand and copy code snippets for popular frameworks"
    
    === "SAM"

        ```yaml hl_lines="5"
        MyLambdaFunction:
          Type: AWS::Serverless::Function
            Properties:
              Layers:
                - !Sub arn:aws:lambda:${AWS::Region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7
        ```

        If you use `esbuild` to bundle your code, make sure to exclude `@aws-lambda-powertools` from being bundled since the packages will be already present the Layer:

        ```yaml hl_lines="5"
        MyLambdaFunction:
          Type: AWS::Serverless::Function
          Properties:
            ...
            Metadata: 
              # Manage esbuild properties
              BuildMethod: esbuild
              BuildProperties:
              Minify: true
              External:
                - '@aws-lambda-powertools/commons'
                - '@aws-lambda-powertools/logger'
                - '@aws-lambda-powertools/metrics'
                - '@aws-lambda-powertools/tracer'
        ```

        Check the [documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-build-typescript.html) for more details.

    === "Serverless framework"

        ```yaml hl_lines="5"
        functions:
          hello:
            handler: lambda_function.lambda_handler
            layers:
              - arn:aws:lambda:${aws::region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7
        ```

        If you use `esbuild` to bundle your code, make sure to exclude `@aws-lambda-powertools` from being bundled since the packages will be already present the Layer:

        ```yaml
        custom:
          esbuild:
            external:
              - '@aws-lambda-powertools/commons'
              - '@aws-lambda-powertools/logger'
              - '@aws-lambda-powertools/metrics'
              - '@aws-lambda-powertools/tracer'
        ```

        Check the [documentation](https://floydspace.github.io/serverless-esbuild/) for more details.

    === "CDK"

        ```typescript hl_lines="13 19"
        import * as cdk from 'aws-cdk-lib';
        import { Construct } from 'constructs';
        import * as lambda from 'aws-cdk-lib/aws-lambda';
        
        export class SampleFunctionWithLayer extends Construct {
          constructor(scope: Construct, id: string) {
            super(scope, id);
          
            // Create a Layer with AWS Lambda Powertools for TypeScript
            const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
              this,
              'PowertoolsLayer',
              `arn:aws:lambda:${cdk.Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7`
            );
            
            new lambda.Function(this, 'Function', {
              runtime: lambda.Runtime.NODEJS_16_X,
              // Add the Layer to a Lambda function
              layers: [powertoolsLayer],
              code: lambda.Code.fromInline(`...`),
              handler: 'index.handler',
            });
          }
        }
        ```

        If you use `esbuild` to bundle your code, make sure to exclude `@aws-lambda-powertools` from being bundled since the packages will be already present the Layer:

        ```typescript
        new awsLambdaNodejs.NodejsFunction(this, 'Function', {
          ...
          bundling: {
            externalModules: [
              '@aws-lambda-powertools/commons',
              '@aws-lambda-powertools/logger',
              '@aws-lambda-powertools/metrics',
              '@aws-lambda-powertools/tracer',
            ],
          }
        });
        ```

        Check the [documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.BundlingOptions.html#externalmodules) for more details.

    === "Terraform"

        ```terraform hl_lines="9 36"
        terraform {
          required_version = "~> 1.0.5"
          required_providers {
            aws = "~> 3.50.0"
          }
        }

        provider "aws" {
          region  = "{aws::region}"
        }

        resource "aws_lambda_function" "test_lambda" {
          filename      = "lambda_function_payload.zip"
          function_name = "lambda_function_name"
          role          = ...
          handler       = "index.handler"
          runtime 		= "nodejs16.x"
          layers 		= ["arn:aws:lambda:{aws::region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7"]
          source_code_hash = filebase64sha256("lambda_function_payload.zip")
        }
        ```

    === "Pulumi"

        ```typescript hl_lines="11"
        import * as pulumi from "@pulumi/pulumi";
        import * as aws from "@pulumi/aws";

        const role = new aws.iam.Role("role", {
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(aws.iam.Principals.LambdaPrincipal),
            managedPolicyArns: [aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole]
        });

        const lambdaFunction = new aws.lambda.Function("function", {
            layers: [
                pulumi.interpolate`arn:aws:lambda:${aws.getRegionOutput().name}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7`
            ],
            code: new pulumi.asset.FileArchive("lambda_function_payload.zip"),
            tracingConfig: {
                mode: "Active"
            },
            runtime: aws.lambda.Runtime.NodeJS16dX,
            handler: "index.handler",
            role: role.arn,
            architectures: ["x86_64"]
        });
        ```

    === "Amplify"

        ```zsh
        # Create a new one with the layer
        ❯ amplify add function
        ? Select which capability you want to add: Lambda function (serverless function)
        ? Provide an AWS Lambda function name: <NAME-OF-FUNCTION>
        ? Choose the runtime that you want to use: NodeJS
        ? Do you want to configure advanced settings? Yes
        ...
        ? Do you want to enable Lambda layers for this function? Yes
        ? Enter up to 5 existing Lambda layer ARNs (comma-separated): arn:aws:lambda:{aws::region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7
        ❯ amplify push -y
        
        # Updating an existing function and add the layer
        ❯ amplify update function
        ? Select the Lambda function you want to update test2
        General information
        - Name: <NAME-OF-FUNCTION>
        ? Which setting do you want to update? Lambda layers configuration
        ? Do you want to enable Lambda layers for this function? Yes
        ? Enter up to 5 existing Lambda layer ARNs (comma-separated): arn:aws:lambda:{aws::region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7
        ? Do you want to edit the local lambda function now? No
        ```

    === "Get the Layer .zip contents"
        ```bash title="AWS CLI"
        aws lambda get-layer-version-by-arn --arn arn:aws:lambda:{aws::region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:7 --region {region}
        ```

        The pre-signed URL to download this Lambda Layer will be within `Location` key.

???+ warning "Warning: Limitations"

	Container Image deployment (OCI) or inline Lambda functions do not support Lambda Layers.


## Instrumentation

You can instrument your code with Powertools in three different ways:  

* **Middy** middleware. It is the best choice if your existing code base relies on the [Middy](https://middy.js.org/docs/) middleware engine. Powertools offers compatible Middy middleware to make this integration seamless.
* **Method decorator**. Use [TypeScript method decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators) if you prefer writing your business logic using [TypeScript Classes](https://www.typescriptlang.org/docs/handbook/classes.html). If you aren’t using Classes, this requires the most significant refactoring.
* **Manually**. It provides the most granular control. It’s the most verbose approach, with the added benefit of no additional dependency and no refactoring to TypeScript Classes.

The examples in this documentation will feature all the approaches described above, when applicable.

## Examples

The project's repository includes examples of how to instrument your functions both in AWS CDK and AWS SAM:

* [AWS CDK](https://github.com/awslabs/aws-lambda-powertools-typescript/tree/main/examples/cdk){target="_blank"}
* [AWS SAM](https://github.com/awslabs/aws-lambda-powertools-typescript/tree/main/examples/sam){target="_blank"}

If instead you want to see Powertools for TypeScript in a slightly more complex use case, check the [Serverless TypeScript Demo](https://github.com/aws-samples/serverless-typescript-demo). You can find instructions on how to deploy and load test this application in the [repository](https://github.com/aws-samples/serverless-typescript-demo).

## Features

Core utilities such as Tracing, Logging, and Metrics will be available across all Lambda Powertools languages. Additional utilities are subjective to each language ecosystem and customer demand.

| Utility                      | Description                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Tracer](./core/tracer.md)   | Decorators and utilities to trace Lambda function handlers, and both synchronous and asynchronous functions   |
| [Logger](./core/logger.md)   | Structured logging made easier, and a middleware to enrich structured logging with key Lambda context details |
| [Metrics](./core/metrics.md) | Custom Metrics created asynchronously via CloudWatch Embedded Metric Format (EMF)                             |

## Environment variables

???+ info
	Explicit parameters take precedence over environment variables

| Environment variable                         | Description                                                                                                   | Utility                   | Default             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------- |
| **POWERTOOLS_SERVICE_NAME**                  | Sets service name used for tracing namespace, metrics dimension and structured logging                        | All                       | `service_undefined` |
| **POWERTOOLS_METRICS_NAMESPACE**             | Sets namespace used for metrics                                                                               | [Metrics](./core/metrics) | `default_namespace` |
| **POWERTOOLS_TRACE_ENABLED**                 | Explicitly disables tracing                                                                                   | [Tracer](./core/tracer)   | `true`              |
| **POWERTOOLS_TRACER_CAPTURE_RESPONSE**       | Captures Lambda or method return as metadata.                                                                 | [Tracer](./core/tracer)   | `true`              |
| **POWERTOOLS_TRACER_CAPTURE_ERROR**          | Captures Lambda or method exception as metadata.                                                              | [Tracer](./core/tracer)   | `true`              |
| **POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS** | Captures HTTP(s) requests as segments.                                                                        | [Tracer](./core/tracer)   | `true`              |
| **POWERTOOLS_LOGGER_LOG_EVENT**              | Logs incoming event                                                                                           | [Logger](./core/logger)   | `false`             |
| **POWERTOOLS_LOGGER_SAMPLE_RATE**            | Debug log sampling                                                                                            | [Logger](./core/logger)   | `0`                 |
| **POWERTOOLS_DEV**                           | Increase JSON indentation to ease debugging when running functions locally or in a non-production environment | [Logger](./core/logger)   | `false`             |
| **LOG_LEVEL**                                | Sets logging level                                                                                            | [Logger](./core/logger)   | `INFO`              |

Each Utility page provides information on example values and allowed values

## Tenets

These are our core principles to guide our decision making.

* **AWS Lambda only**. We optimise for AWS Lambda function environments and supported runtimes only. Utilities might work with web frameworks and non-Lambda environments, though they are not officially supported.
* **Eases the adoption of best practices**. The main priority of the utilities is to facilitate best practices adoption, as defined in the AWS Well-Architected Serverless Lens; all other functionality is optional.
* **Keep it lean**. Additional dependencies are carefully considered for security and ease of maintenance, and prevent negatively impacting startup time.
* **We strive for backwards compatibility**. New features and changes should keep backwards compatibility. If a breaking change cannot be avoided, the deprecation and migration process should be clearly defined.
* **We work backwards from the community**. We aim to strike a balance of what would work best for 80% of customers. Emerging practices are considered and discussed via Requests for Comment (RFCs)
* **Progressive**. Utilities are designed to be incrementally adoptable for customers at any stage of their Serverless journey. They follow language idioms and their community’s common practices.
    