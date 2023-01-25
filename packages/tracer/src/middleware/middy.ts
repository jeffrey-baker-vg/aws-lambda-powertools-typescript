import type { Tracer } from '../Tracer';
import type { Segment, Subsegment } from 'aws-xray-sdk-core';
import type { CaptureLambdaHandlerOptions } from '../types';
import type {
  MiddlewareLikeObj,
  MiddyLikeRequest
} from '@aws-lambda-powertools/commons';

/**
 * A middy middleware automating capture of metadata and annotations on segments or subsegments for a Lambda Handler.
 * 
 * Using this middleware on your handler function will automatically:
 * * handle the subsegment lifecycle 
 * * add the `ColdStart` annotation
 * * add the function response as metadata
 * * add the function error as metadata (if any)
 * 
 * @example
 * ```typescript
 * import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
 * import middy from '@middy/core';
 * 
 * const tracer = new Tracer({ serviceName: 'serverlessAirline' });
 * 
 * const lambdaHandler = async (_event: any, _context: any) => {
 *   ...
 * };
 * 
 * export const handler = middy(lambdaHandler).use(captureLambdaHandler(tracer));
 * ```
 * 
 * @param target - The Tracer instance to use for tracing
 * @param options - (_optional_) Options for the middleware
 * @returns middleware - The middy middleware object
 */
const captureLambdaHandler = (target: Tracer, options?: CaptureLambdaHandlerOptions): MiddlewareLikeObj => {
  let lambdaSegment: Subsegment | Segment;

  const open = (): void => {
    lambdaSegment = target.getSegment();
    const handlerSegment = lambdaSegment.addNewSubsegment(`## ${process.env._HANDLER}`);
    target.setSegment(handlerSegment);
  };

  const close = (): void => {
    const subsegment = target.getSegment();
    subsegment.close();
    target.setSegment(lambdaSegment as Segment);
  };

  const captureLambdaHandlerBefore = async (): Promise<void> => {
    if (target.isTracingEnabled()) {
      open();
      target.annotateColdStart();
      target.addServiceNameAnnotation();
    }
  };
  
  const captureLambdaHandlerAfter = async (request: MiddyLikeRequest): Promise<void> => {
    if (target.isTracingEnabled()) {
      if (options?.captureResponse ?? true) {
        target.addResponseAsMetadata(request.response, process.env._HANDLER);
      }
      close();
    }
  };
  
  const captureLambdaHandlerError = async (request: MiddyLikeRequest): Promise<void> => {
    if (target.isTracingEnabled()) {
      target.addErrorAsMetadata(request.error as Error);
      close();
    }
  };

  return {
    before: captureLambdaHandlerBefore,
    after: captureLambdaHandlerAfter,
    onError: captureLambdaHandlerError
  };
};

export { 
  captureLambdaHandler,
};