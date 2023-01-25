/**
 * Test IdempotencyRecord class
 *
 * @group unit/idempotency/all
 */
import { IdempotencyInvalidStatusError } from '../../../src/Exceptions';
import { IdempotencyRecord } from '../../../src/persistence/IdempotencyRecord';
import { IdempotencyRecordStatus } from '../../../src/types/IdempotencyRecordStatus';

const mockIdempotencyKey = '123';
const mockData = undefined;
const mockInProgressExpiry = 123;
const mockPayloadHash = '123';

describe('Given an INPROGRESS record that has already expired', () => {
  let idempotencyRecord: IdempotencyRecord;
  beforeEach(() => {
    const mockNowAfterExpiryTime = 1487076708000;
    const expiryTimeBeforeNow = 1487076707;
    Date.now = jest.fn(() => mockNowAfterExpiryTime);
    idempotencyRecord = new IdempotencyRecord({
      idempotencyKey: mockIdempotencyKey, 
      status: IdempotencyRecordStatus.INPROGRESS, 
      expiryTimestamp: expiryTimeBeforeNow, 
      inProgressExpiryTimestamp: mockInProgressExpiry, 
      responseData: mockData, 
      payloadHash: mockPayloadHash
    });
  });
  describe('When checking the status of the idempotency record', () => {
    let resultingStatus: IdempotencyRecordStatus;
    beforeEach(() => {
      resultingStatus = idempotencyRecord.getStatus();
    });

    test('Then the status is EXPIRED', () => {
      expect(resultingStatus).toEqual(IdempotencyRecordStatus.EXPIRED); 
    });
  });
});

describe('Given an idempotency record that is not expired', () => {
  let idempotencyRecord: IdempotencyRecord; 
  beforeEach(() => {
    const mockNowBeforeExiryTime = 1487076707000;
    const expiryTimeAfterNow = 1487076708;
    Date.now = jest.fn(() => mockNowBeforeExiryTime);
    idempotencyRecord = new IdempotencyRecord({
      idempotencyKey: mockIdempotencyKey, 
      status: IdempotencyRecordStatus.INPROGRESS, 
      expiryTimestamp: expiryTimeAfterNow, 
      inProgressExpiryTimestamp: mockInProgressExpiry, 
      responseData: mockData, 
      payloadHash: mockPayloadHash
    });
  });
  describe('When checking the status of the idempotency record', () => {  
    test('Then the status is EXPIRED', () => {
      expect(idempotencyRecord.getStatus()).toEqual(IdempotencyRecordStatus.INPROGRESS); 
    });

    test('Then the record is returned', () => {
      expect(idempotencyRecord.getResponse()).toEqual(mockData); 
    });
  });
});

describe('Given an idempotency record that has a status not in the IdempotencyRecordStatus enum', () => {
  let idempotencyRecord: IdempotencyRecord; 
  beforeEach(() => {
    const mockNowBeforeExiryTime = 1487076707000;
    const expiryTimeAfterNow = 1487076708;
    Date.now = jest.fn(() => mockNowBeforeExiryTime);
    idempotencyRecord = new IdempotencyRecord({
      idempotencyKey: mockIdempotencyKey, 
      status: 'NOT_A_STATUS' as IdempotencyRecordStatus, 
      expiryTimestamp: expiryTimeAfterNow, 
      inProgressExpiryTimestamp: mockInProgressExpiry, 
      responseData: mockData, 
      payloadHash: mockPayloadHash
    });
  });
  describe('When checking the status of the idempotency record', () => {
    let resultingError: Error;
    beforeEach(() => {
      try {
        idempotencyRecord.getStatus();
      } catch (e: unknown) {
        resultingError = e as Error;
      }

    });
    
    test('Then an IdempotencyInvalidStatusError is thrown ', () => {
      expect(resultingError).toBeInstanceOf(IdempotencyInvalidStatusError); 
    });
  });
});