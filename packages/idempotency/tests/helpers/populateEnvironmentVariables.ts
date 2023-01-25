// Reserved variables
<<<<<<< HEAD
process.env.AWS_REGION = 'us-east-1';
=======
process.env._X_AMZN_TRACE_ID = '1-abcdef12-3456abcdef123456abcdef12';
process.env.AWS_LAMBDA_FUNCTION_NAME = 'my-lambda-function';
process.env.AWS_EXECUTION_ENV = 'nodejs16.x';
process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '128';
if (process.env.AWS_REGION === undefined && process.env.CDK_DEFAULT_REGION === undefined) {
  process.env.AWS_REGION = 'eu-west-1';
}
process.env._HANDLER = 'index.handler';
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
