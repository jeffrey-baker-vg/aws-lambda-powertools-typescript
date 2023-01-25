import { IdempotencyRecord } from './IdempotencyRecord';
<<<<<<< HEAD

interface PersistenceLayerInterface {
  configure(functionName: string): void
=======
import type { PersistenceLayerConfigureOptions } from '../types/PersistenceLayer';

interface PersistenceLayerInterface {
  configure(options?: PersistenceLayerConfigureOptions): void
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
  saveInProgress(data: unknown): Promise<void>
  saveSuccess(data: unknown, result: unknown): Promise<void>
  deleteRecord(data: unknown): Promise<void>
  getRecord(data: unknown): Promise<IdempotencyRecord>
}

export { PersistenceLayerInterface };
