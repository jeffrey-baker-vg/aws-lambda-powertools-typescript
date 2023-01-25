---
title: Parameters
description: Utility
---

???+ warning
	This page refers to an **unreleased and upcoming utility**. Please refer to this [GitHub milestone](https://github.com/awslabs/aws-lambda-powertools-typescript/milestone/8) for the latest updates.

The Parameters utility provides high-level functions to retrieve one or multiple parameter values from [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html){target="_blank"}, [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html){target="_blank"}, [AWS AppConfig](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html){target="_blank"}, [Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html){target="_blank"}, or your own parameter store.

## Key features

* Retrieve one or multiple parameters from the underlying provider
* Cache parameter values for a given amount of time (defaults to 5 seconds)
* Transform parameter values from JSON or base 64 encoded strings
* Bring Your Own Parameter Store Provider

## Getting started

The Parameters Utility helps to retrieve parameters from the System Manager Parameter Store (SSM), secrets from the Secrets Manager, and application configuration from AppConfig. Additionally, the utility also offers support for a DynamoDB provider, enabling the retrieval of arbitrary parameters from specified tables.

### Installation

???+ note
	This utility supports **[AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) only**. This allows the utility to be modular, and you to install only the SDK packages you need and keep your bundle size small.

Depending on the provider you want to use, install the library and the corresponding AWS SDK package:

=== "SSMProvider"
	```bash
	npm install @aws-lambda-powertools/parameters @aws-sdk/client-ssm
	```

=== "SecretsProvider"
	```bash
	npm install @aws-lambda-powertools/parameters @aws-sdk/client-secrets-manager
	```

=== "AppConfigProvider"
	```bash
	npm install @aws-lambda-powertools/parameters @aws-sdk/client-appconfigdata
	```

=== "DynamoDBProvider"
	```bash
	npm install @aws-lambda-powertools/parameters @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
	```

???+ tip
	If you are using the `nodejs18.x` runtime, the AWS SDK for JavaScript v3 is already installed and you can install the utility only.

### IAM Permissions

This utility requires additional permissions to work as expected.

???+ note
    Different parameter providers require different permissions.

| Provider  | Function/Method                                                  | IAM Permission                                                                       |
| --------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| SSM       | **`getParameter`**, **`SSMProvider.get`**                        | **`ssm:GetParameter`**                                                               |
| SSM       | **`getParameters`**, **`SSMProvider.getMultiple`**               | **`ssm:GetParametersByPath`**                                                        |
| SSM       | **`getParametersByName`**, **`SSMProvider.getParametersByName`** | **`ssm:GetParameter`** and **`ssm:GetParameters`**                                   |
| SSM       | If using **`decrypt: true`**                                     | You must add an additional permission **`kms:Decrypt`**                              |
| Secrets   | **`getSecret`**, **`SecretsProvider.get`**                       | **`secretsmanager:GetSecretValue`**                                                  |
| DynamoDB  | **`DynamoDBProvider.get`**                                       | **`dynamodb:GetItem`**                                                               |
| DynamoDB  | **`DynamoDBProvider.getMultiple`**                               | **`dynamodb:Query`**                                                                 |
| AppConfig | **`getAppConfig`**, **`AppConfigProvider.getAppConfig`**         | **`appconfig:GetLatestConfiguration`** and **`appconfig:StartConfigurationSession`** |

### Fetching parameters

You can retrieve a single parameter using the `getParameter` high-level function.

```typescript hl_lines="1 5" title="Fetching a single parameter from SSM"
--8<-- "docs/snippets/parameters/getParameter.ts"
```

For multiple parameters, you can use either:

* `getParameters` to recursively fetch all parameters by path.
* `getParametersByName` to fetch distinct parameters by their full name. It also accepts custom caching, transform, decrypt per parameter.

=== "getParameters"

    ```typescript hl_lines="1 8" title="Fetching multiple parameters by path from SSM"
    --8<-- "docs/snippets/parameters/getParameters.ts"
    ```

=== "getParametersByName"

    ```typescript hl_lines="1-4 7-9 14" title="Fetching multiple parameters by names from SSM"
    --8<-- "docs/snippets/parameters/getParametersByName.ts"
    ```

???+ tip "`getParametersByName` supports graceful error handling"
	By default, the provider will throw a `GetParameterError` when any parameter fails to be fetched. You can override it by setting `throwOnError: false`.

	When disabled, instead the provider will take the following actions:

	* Add failed parameter name in the `_errors` key, _e.g._, `{ _errors: [ '/param1', '/param2' ] }`
	* Keep only successful parameter names and their values in the response
	* Throw `GetParameterError` if any of your parameters is named `_errors`

```typescript hl_lines="1-4 7-8 13 15 18"
--8<-- "docs/snippets/parameters/getParametersByNameGracefulErrorHandling.ts"
```

### Fetching secrets

You can fetch secrets stored in Secrets Manager using `getSecrets`.

```typescript hl_lines="1 5" title="Fetching secrets"
--8<-- "docs/snippets/parameters/getSecret.ts"
```

### Fetching app configurations

You can fetch application configurations in AWS AppConfig using `getAppConfig`.

The following will retrieve the latest version and store it in the cache.

```typescript hl_lines="1 5-8" title="Fetching latest config from AppConfig"
--8<-- "docs/snippets/parameters/getAppConfig.ts"
```

## Advanced

### Adjusting cache TTL

???+ tip
	`maxAge` parameter is also available in high level functions like `getParameter`, `getSecret`, etc.

By default, the provider will cache parameters retrieved in-memory for 5 seconds.

You can adjust how long values should be kept in cache by using the param `maxAge`, when using  `get()` or `getMultiple()` methods across all providers.

```typescript hl_lines="7 10" title="Caching parameters values in memory for longer than 5 seconds"
--8<-- "docs/snippets/parameters/adjustingCacheTTL.ts"
```

### Always fetching the latest

If you'd like to always ensure you fetch the latest parameter from the store regardless if already available in cache, use the `forceFetch` parameter.

```typescript hl_lines="5" title="Forcefully fetching the latest parameter whether TTL has expired or not"
--8<-- "docs/snippets/parameters/forceFetch.ts"
```

### Built-in provider class

For greater flexibility such as configuring the underlying SDK client used by built-in providers, you can use their respective Provider Classes directly.

???+ tip
    This can be used to retrieve values from other regions, change the retry behavior, etc.

#### SSMProvider

```typescript hl_lines="4-5" title="Example with SSMProvider for further extensibility"
--8<-- "docs/snippets/parameters/ssmProvider.ts"
```

The AWS Systems Manager Parameter Store provider supports two additional arguments for the `get()` and `getMultiple()` methods:

| Parameter     | Default | Description                                                                                   |
| ------------- | ------- | --------------------------------------------------------------------------------------------- |
| **decrypt**   | `false` | Will automatically decrypt the parameter (see required [IAM Permissions](#iam-permissions)).  |
| **recursive** | `true`  | For `getMultiple()` only, will fetch all parameter values recursively based on a path prefix. |

```typescript hl_lines="6 8" title="Example with get() and getMultiple()"
--8<-- "docs/snippets/parameters/ssmProviderDecryptAndRecursive.ts"
```

#### SecretsProvider

```typescript hl_lines="4-5" title="Example with SecretsProvider for further extensibility"
--8<-- "docs/snippets/parameters/secretsProvider.ts"
```

#### AppConfigProvider

The AWS AppConfig provider requires two arguments when initialized:

| Parameter       | Mandatory in constructor | Alternative                            | Description                                              |
| --------------- | ------------------------ | -------------------------------------- | -------------------------------------------------------- |
| **application** | No                       | `POWERTOOLS_SERVICE_NAME` env variable | The application in which your config resides.            |
| **environment** | Yes                      | _(N/A)_                                | The environment that corresponds to your current config. |

```typescript hl_lines="4 8" title="Example with AppConfigProvider for further extensibility"
--8<-- "docs/snippets/parameters/appConfigProvider.ts"
```

#### DynamoDBProvider

The DynamoDB Provider does not have any high-level functions and needs to know the name of the DynamoDB table containing the parameters.

**DynamoDB table structure for single parameters**

For single parameters, you must use `id` as the [partition key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey) for that table.

???+ example

	DynamoDB table with `id` partition key and `value` as attribute

 | id           | value    |
 | ------------ | -------- |
 | my-parameter | my-value |

With this table, `await dynamoDBProvider.get('my-param')` will return `my-value`.

=== "handler.ts"
	```typescript hl_lines="3 7"
	--8<-- "docs/snippets/parameters/dynamoDBProvider.ts"
	```

=== "DynamoDB Local example"
	You can initialize the DynamoDB provider pointing to [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) using the `endpoint` field in the `clientConfig` parameter:

	```typescript hl_lines="5-7"
	--8<-- "docs/snippets/parameters/dynamoDBProviderLocal.ts"
	```

**DynamoDB table structure for multiple values parameters**

You can retrieve multiple parameters sharing the same `id` by having a sort key named `sk`.

???+ example

	DynamoDB table with `id` primary key, `sk` as sort key and `value` as attribute

 | id          | sk      | value      |
 | ----------- | ------- | ---------- |
 | my-hash-key | param-a | my-value-a |
 | my-hash-key | param-b | my-value-b |
 | my-hash-key | param-c | my-value-c |

With this table, `await dynamoDBProvider.getMultiple('my-hash-key')` will return a dictionary response in the shape of `sk:value`.

=== "handler.ts"
	```typescript hl_lines="3 10"
	--8<-- "docs/snippets/parameters/dynamoDBProviderMultiple.ts"
	```

=== "values response object"

	```json
	{
	  "param-a": "my-value-a",
	  "param-b": "my-value-b",
	  "param-c": "my-value-c"
	}
	```

**Customizing DynamoDBProvider**

DynamoDB provider can be customized at initialization to match your table structure:

| Parameter     | Mandatory | Default | Description                                                                                               |
| ------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------- |
| **tableName** | **Yes**   | *(N/A)* | Name of the DynamoDB table containing the parameter values.                                               |
| **keyAttr**   | No        | `id`    | Hash key for the DynamoDB table.                                                                          |
| **sortAttr**  | No        | `sk`    | Range key for the DynamoDB table. You don't need to set this if you don't use the `getMultiple()` method. |
| **valueAttr** | No        | `value` | Name of the attribute containing the parameter value.                                                     |

```typescript hl_lines="3-8" title="Customizing DynamoDBProvider to suit your table design"
--8<-- "docs/snippets/parameters/dynamoDBProviderCustomizeTable.ts"
```

### Deserializing values with transform parameter

For parameters stored in JSON or Base64 format, you can use the `transform` argument for deserialization.

???+ info
    The `transform` argument is available across all providers, including the high level functions.

=== "High level functions"
	```typescript hl_lines="4"
	--8<-- "docs/snippets/parameters/transform.ts"
	```

=== "Providers"
	```typescript hl_lines="7 10"
	--8<-- "docs/snippets/parameters/transformProvider.ts"
	```

#### Partial transform failures with `getMultiple()`

If you use `transform` with `getMultiple()`, you can have a single malformed parameter value. To prevent failing the entire request, the method will return an `undefined` value for the parameters that failed to transform.

You can override this by setting the `throwOnTransformError` argument to `true`. If you do so, a single transform error will throw a **`TransformParameterError`** error.

For example, if you have three parameters, */param/a*, */param/b* and */param/c*, but */param/c* is malformed:

```typescript hl_lines="19-22" title="Throwing TransformParameterError at first malformed parameter"
--8<-- "docs/snippets/parameters/transformPartialFailures.ts"
```

#### Auto-transform values on suffix

If you use `transform` with `getMultiple()`, you might want to retrieve and transform parameters encoded in different formats.

You can do this with a single request by using `transform: 'auto'`. This will instruct any provider to to infer its type based on the suffix and transform it accordingly.

???+ info
    `transform: 'auto'` feature is available across all providers, including the high level functions.

```typescript hl_lines="6" title="Deserializing parameter values based on their suffix"
--8<-- "docs/snippets/parameters/transformAuto.ts"
```

For example, if you have three parameters: two with the following suffixes `.json` and `.binary` and one without any suffix:

| Parameter name  | Parameter value      |
| --------------- | -------------------- |
| /param/a        | [some encoded value] |
| /param/a.json   | [some encoded value] |
| /param/a.binary | [some encoded value] |

The return of `await parametersProvider.getMultiple('/param', transform: 'auto');` call will be an object like:

```json
{
  "a": [some encoded value],
  "a.json": [some decoded value],
  "b.binary": [some decoded value]
}
```

The two parameters with a suffix will be decoded, while the one without a suffix will be returned as is.

### Passing additional SDK arguments

You can use a special `sdkOptions` object argument to pass any supported option directly to the underlying SDK method.

```typescript hl_lines="8 14" title="Specify a VersionId for a secret"
--8<-- "docs/snippets/parameters/sdkOptions.ts"
```

Here is the mapping between this utility's functions and methods and the underlying SDK:

| Provider            | Function/Method                | Client name                       | Function name                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSM Parameter Store | `getParameter`                 | `@aws-sdk/client-ssm`             | [GetParameterCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametercommand.html)                                                                                                                                                                                                       |
| SSM Parameter Store | `getParameters`                | `@aws-sdk/client-ssm`             | [GetParametersByPathCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametersbypathcommand.html)                                                                                                                                                                                         |
| SSM Parameter Store | `SSMProvider.get`              | `@aws-sdk/client-ssm`             | [GetParameterCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametercommand.html)                                                                                                                                                                                                       |
| SSM Parameter Store | `SSMProvider.getMultiple`      | `@aws-sdk/client-ssm`             | [GetParametersByPathCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametersbypathcommand.html)                                                                                                                                                                                         |
| Secrets Manager     | `getSecret`                    | `@aws-sdk/client-secrets-manager` | [GetSecretValueCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/classes/getsecretvaluecommand.html)                                                                                                                                                                                       |
| Secrets Manager     | `SecretsProvider.get`          | `@aws-sdk/client-secrets-manager` | [GetSecretValueCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/classes/getsecretvaluecommand.html)                                                                                                                                                                                       |
| AppConfig           | `AppConfigProvider.get`        | `@aws-sdk/client-appconfigdata`   | [StartConfigurationSessionCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfigdata/classes/startconfigurationsessioncommand.html) & [GetLatestConfigurationCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfigdata/classes/getlatestconfigurationcommand.html) |
| AppConfig           | `getAppConfig`                 | `@aws-sdk/client-appconfigdata`   | [StartConfigurationSessionCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfigdata/classes/startconfigurationsessioncommand.html) & [GetLatestConfigurationCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfigdata/classes/getlatestconfigurationcommand.html) |
| DynamoDB            | `DynamoDBProvider.get`         | `@aws-sdk/client-dynamodb`        | [GetItemCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/getitemcommand.html)                                                                                                                                                                                                            |
| DynamoDB            | `DynamoDBProvider.getMultiple` | `@aws-sdk/client-dynamodb`        | [QueryCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html)                                                                                                                                                                                                                |

### Bring your own AWS SDK v3 client

You can use the `awsSdkV3Client` parameter via any of the available [Provider Classes](#built-in-provider-class).

| Provider                                | Client                        |
| --------------------------------------- | ----------------------------- |
| [SSMProvider](#ssmprovider)             | `new SSMClient();`            |
| [SecretsProvider](#secretsprovider)     | `new SecretsManagerClient();` |
| [AppConfigProvider](#appconfigprovider) | `new AppConfigDataClient();`  |
| [DynamoDBProvider](#dynamodbprovider)   | `new DynamoDBClient();`       |

???+ question "When is this useful?"
	Injecting a custom AWS SDK v3 client allows you to [apply tracing](/core/tracer/#patching-aws-sdk-clients) or make unit/snapshot testing easier, including SDK customizations.

=== "SSMProvider"
	```typescript hl_lines="5 7"
	--8<-- "docs/snippets/parameters/ssmProviderCustomClient.ts"
	```

=== "SecretsProvider"
	```typescript hl_lines="5 7"
	--8<-- "docs/snippets/parameters/secretsProviderCustomClient.ts"
	```

=== "AppConfigProvider"
	```typescript hl_lines="5 7"
	--8<-- "docs/snippets/parameters/appConfigProviderCustomClient.ts"
	```

=== "DynamoDBProvider"
	```typescript hl_lines="5 7"
	--8<-- "docs/snippets/parameters/dynamoDBProviderCustomClient.ts"
	```

### Customizing AWS SDK v3 configuration

The **`clientConfig`** parameter enables you to pass in a custom [config object](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/configuring-the-jssdk.html) when constructing any of the built-in provider classes.

???+ tip
	You can use a custom session for retrieving parameters cross-account/region and for snapshot testing.

	When using VPC private endpoints, you can pass a custom client altogether. It's also useful for testing when injecting fake instances.


```typescript hl_lines="2 4-5"
--8<-- "docs/snippets/parameters/clientConfig.ts"
```
