import { Tracer } from '../../src';
import { Context } from 'aws-lambda';
import axios from 'axios';
import AWS from 'aws-sdk';

const serviceName = process.env.EXPECTED_SERVICE_NAME ?? 'MyFunctionWithStandardHandler';
const customAnnotationKey = process.env.EXPECTED_CUSTOM_ANNOTATION_KEY ?? 'myAnnotation';
const customAnnotationValue = process.env.EXPECTED_CUSTOM_ANNOTATION_VALUE ?? 'myValue';
const customMetadataKey = process.env.EXPECTED_CUSTOM_METADATA_KEY ?? 'myMetadata';
const customMetadataValue = process.env.EXPECTED_CUSTOM_METADATA_VALUE ? JSON.parse(process.env.EXPECTED_CUSTOM_METADATA_VALUE) : { bar: 'baz' };
const customResponseValue = process.env.EXPECTED_CUSTOM_RESPONSE_VALUE ? JSON.parse(process.env.EXPECTED_CUSTOM_RESPONSE_VALUE) : { foo: 'bar' };
const customErrorMessage = process.env.EXPECTED_CUSTOM_ERROR_MESSAGE ?? 'An error has occurred';
const testTableName = process.env.TEST_TABLE_NAME ?? 'TestTable';

interface CustomEvent {
  throw: boolean
  invocation: number
}

const tracer = new Tracer({ serviceName: serviceName });
const dynamoDB = tracer.captureAWSClient(new AWS.DynamoDB.DocumentClient());

export const handler = async (event: CustomEvent, _context: Context): Promise<void> => {
  const segment = tracer.getSegment();
  const subsegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);
  tracer.setSegment(subsegment);

  tracer.annotateColdStart();
  tracer.addServiceNameAnnotation();

  tracer.putAnnotation('invocation', event.invocation);
  tracer.putAnnotation(customAnnotationKey, customAnnotationValue);
  tracer.putMetadata(customMetadataKey, customMetadataValue);

  try {
    await dynamoDB.put({ TableName: testTableName, Item: { id: `${serviceName}-${event.invocation}-sdkv2` } }).promise();
    await axios.get('https://awslabs.github.io/aws-lambda-powertools-typescript/latest/', { timeout: 5000 });

    const res = customResponseValue;
    if (event.throw) {
      throw new Error(customErrorMessage);
    }
    tracer.addResponseAsMetadata(res, process.env._HANDLER);

    return res;
  } catch (err) {
    tracer.addErrorAsMetadata(err as Error);
    throw err;
  } finally {
    subsegment.close();
    tracer.setSegment(segment);
  }
};