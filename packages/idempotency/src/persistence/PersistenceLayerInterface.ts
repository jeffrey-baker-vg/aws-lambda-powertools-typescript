import { IdempotencyRecord } from './IdempotencyRecord';
import { PersistenceLayerConfigureOptions } from '../types';
interface PersistenceLayerInterface {
  configure(options?: PersistenceLayerConfigureOptions): void
  saveInProgress(data: unknown): Promise<void>
  saveSuccess(data: unknown, result: unknown): Promise<void>
  deleteRecord(data: unknown): Promise<void>
  getRecord(data: unknown): Promise<IdempotencyRecord>
}

export { PersistenceLayerInterface };
