import { Tracer } from '../../src';
import { Callback, Context } from 'aws-lambda';
import AWS from 'aws-sdk';
import axios from 'axios';

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
tracer.captureAWS(AWS);
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export class MyFunctionBase {
  private readonly returnValue: string;

  public constructor() {
    this.returnValue = customResponseValue;
  }

  public handler(event: CustomEvent, _context: Context, _callback: Callback<unknown>): void | Promise<unknown> {
    tracer.putAnnotation(customAnnotationKey, customAnnotationValue);
    tracer.putMetadata(customMetadataKey, customMetadataValue);
    
    return Promise.all([
      dynamoDB.put({ TableName: testTableName, Item: { id: `${serviceName}-${event.invocation}-sdkv2` } }).promise(),
      axios.get('https://awslabs.github.io/aws-lambda-powertools-typescript/latest/', { timeout: 5000 }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const res = this.myMethod();
          if (event.throw) {
            reject(new Error(customErrorMessage));
          } else {
            resolve(res);
          }
        }, 2000); // We need to wait for to make sure previous calls are finished
      })
    ])
      .then(([ _dynamoDBRes, _axiosRes, promiseRes ]) => promiseRes)
      .catch((err) => {
        throw err;
      });
  }

  public myMethod(): string {
    return this.returnValue;
  }
}

class MyFunctionWithDecorator extends MyFunctionBase {
  @tracer.captureLambdaHandler()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public handler(event: CustomEvent, _context: Context, _callback: Callback<unknown>): void | Promise<unknown> {
    return super.handler(event, _context, _callback);
  }

  @tracer.captureMethod()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public myMethod(): string {
    return super.myMethod();
  }
}

const handlerClass = new MyFunctionWithDecorator();
export const handler = handlerClass.handler.bind(handlerClass);

class MyFunctionWithDecoratorCaptureResponseFalse extends MyFunctionBase {
  @tracer.captureLambdaHandler({ captureResponse: false })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public handler(event: CustomEvent, _context: Context, _callback: Callback<unknown>): void | Promise<unknown> {
    return super.handler(event, _context, _callback);
  }

  @tracer.captureMethod({ captureResponse: false })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public myMethod(): string {
    return super.myMethod();
  }
}

const handlerWithCaptureResponseFalseClass = new MyFunctionWithDecoratorCaptureResponseFalse();
export const handlerWithCaptureResponseFalse = handlerWithCaptureResponseFalseClass.handler.bind(handlerWithCaptureResponseFalseClass);