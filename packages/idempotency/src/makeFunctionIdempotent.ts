<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyFunctionWithRecord, AnyIdempotentFunction } from './types/AnyFunction';
import { IdempotencyOptions } from './IdempotencyOptions';
import { IdempotencyHandler } from './IdempotencyHandler';

const makeFunctionIdempotent = function <U>(
  fn: AnyFunctionWithRecord<U>,
  options: IdempotencyOptions
): AnyIdempotentFunction<U> {
  const wrappedFunction: AnyIdempotentFunction<U> = function (record: Record<string, any>): Promise<U> {
    const idempotencyHandler: IdempotencyHandler<U> = new IdempotencyHandler<U>(fn, record[options.dataKeywordArgument], options, record);

    return idempotencyHandler.process_idempotency();
  };

  return wrappedFunction;
};
=======
import type { AnyFunction } from './types/AnyFunction';
import type { IdempotencyOptions } from './types/IdempotencyOptions';

const makeFunctionIdempotent = <U>(
  fn: AnyFunction<U>,
  _options: IdempotencyOptions
  // TODO: revisit this with a more specific type if possible
  /* eslint-disable @typescript-eslint/no-explicit-any */
): (...args: Array<any>) => Promise<U | void> => (...args) => fn(...args);
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc

export { makeFunctionIdempotent };
