<<<<<<< HEAD
import { DeleteCommand, DynamoDBDocument, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { IdempotencyItemAlreadyExistsError, IdempotencyItemNotFoundError } from '../../../src/Exceptions';
import { DynamoDBPersistenceLayer } from '../../../src/persistence/DynamoDbPersistenceLayer';
import { IdempotencyRecord } from '../../../src/persistence/IdempotencyRecord';
import { IdempotencyRecordStatus } from '../../../src/types/IdempotencyRecordStatus';

=======
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
/**
  * Test DynamoDBPersistenceLayer class
 *
 * @group unit/idempotency/all
 */
<<<<<<< HEAD

describe('Class: DynamoDbPersistenceLayer', () => {
  class TestDynamoPersistenceLayer extends DynamoDBPersistenceLayer {
=======
import { DeleteCommand, DynamoDBDocument, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { IdempotencyItemAlreadyExistsError, IdempotencyItemNotFoundError } from '../../../src/Exceptions';
import { DynamoDBPersistenceLayer } from '../../../src/persistence/DynamoDBPersistenceLayer';
import { IdempotencyRecord } from '../../../src/persistence/IdempotencyRecord';
import { DynamoPersistenceConstructorOptions } from '../../../src/types/DynamoPersistenceConstructorOptions';
import { IdempotencyRecordStatus } from '../../../src/types/IdempotencyRecordStatus';

describe('Class: DynamoDBPersistenceLayer', () => {

  const dummyTableName = 'someTable';
  const dummyKey = 'someKey';

  class TestDynamoDBPersistenceLayer extends DynamoDBPersistenceLayer {

>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
    public _deleteRecord(record: IdempotencyRecord): Promise<void> {
      return super._deleteRecord(record);
    }

    public _getRecord(idempotencyKey: string): Promise<IdempotencyRecord> {
      return super._getRecord(idempotencyKey);
    }

    public _putRecord(_record: IdempotencyRecord): Promise<void> {
      return super._putRecord(_record);
    }

    public _updateRecord(record: IdempotencyRecord): Promise<void> {
      return super._updateRecord(record);
    }
<<<<<<< HEAD
=======

>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

<<<<<<< HEAD
  describe('Method: _putRecord', () => {
=======
  describe('Method: constructor', () => {

    test('when instantiated with minimum options it creates an instance with default values', () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });

      // Act / Assess
      expect(persistenceLayer).toEqual(expect.objectContaining({
        tableName: dummyTableName,
        keyAttr: 'id',
        statusAttr: 'status',
        expiryAttr: 'expiration',
        inProgressExpiryAttr: 'in_progress_expiry_attr',
        dataAttr: 'data'
      }));

    });

    test('when instantiated with specific options it creates an instance with correct values', () => {

      // Prepare
      const testDynamoDBPersistenceLayerOptions: DynamoPersistenceConstructorOptions = {
        tableName: dummyTableName,
        keyAttr: dummyKey,
        statusAttr: 'someStatusAttr',
        expiryAttr: 'someExpiryAttr',
        inProgressExpiryAttr: 'someInProgressExpiryAttr',
        dataAttr: 'someDataAttr'
      };
      const persistenceLayer = new TestDynamoDBPersistenceLayer(testDynamoDBPersistenceLayerOptions);

      // Act / Assess
      expect(persistenceLayer).toEqual(expect.objectContaining({
        tableName: dummyTableName,
        keyAttr: dummyKey,
        statusAttr: testDynamoDBPersistenceLayerOptions.statusAttr,
        expiryAttr: testDynamoDBPersistenceLayerOptions.expiryAttr,
        inProgressExpiryAttr: testDynamoDBPersistenceLayerOptions.inProgressExpiryAttr,
        dataAttr: testDynamoDBPersistenceLayerOptions.dataAttr
      }));

    });

  });

  describe('Method: _putRecord', () => {

>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
    const currentDateInMilliseconds = 1000;
    const currentDateInSeconds = 1;

    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(currentDateInMilliseconds);
    });

<<<<<<< HEAD
    test('when called with a record that meets conditions, it puts record in dynamo table', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';
=======
    test('when called with a record that meets conditions, it puts record in DynamoDB table', async () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.EXPIRED;
      const expiryTimestamp = 0;
      const inProgressExpiryTimestamp = 0;
      const record = new IdempotencyRecord({
<<<<<<< HEAD
        idempotencyKey: key, 
=======
        idempotencyKey: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        status, 
        expiryTimestamp, 
        inProgressExpiryTimestamp
      });
      const dynamoClient = mockClient(DynamoDBDocument).on(PutCommand).resolves({});

      // Act
      await persistenceLayer._putRecord(record);

      // Assess
      expect(dynamoClient).toReceiveCommandWith(PutCommand, {
<<<<<<< HEAD
        TableName: tableName,
        Item: { 'id': key, 'expiration': expiryTimestamp, status: status },
=======
        TableName: dummyTableName,
        Item: { 'id': dummyKey, 'expiration': expiryTimestamp, status: status },
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        ExpressionAttributeNames: { '#id': 'id', '#expiry': 'expiration', '#status': 'status' },
        ExpressionAttributeValues: { ':now': currentDateInSeconds, ':inprogress': IdempotencyRecordStatus.INPROGRESS },
        ConditionExpression: 'attribute_not_exists(#id) OR #expiry < :now OR NOT #status = :inprogress'
      });
<<<<<<< HEAD
    });

    test('when called with a record that fails any condition, it throws IdempotencyItemAlreadyExistsError', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';
=======

    });

    test('when called with a record that fails any condition, it throws IdempotencyItemAlreadyExistsError', async () => {
      
      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.EXPIRED;
      const expiryTimestamp = 0;
      const inProgressExpiryTimestamp = 0;
      const record = new IdempotencyRecord({ 
<<<<<<< HEAD
        idempotencyKey: key, 
=======
        idempotencyKey: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        status, 
        expiryTimestamp, 
        inProgressExpiryTimestamp
      });
<<<<<<< HEAD

      const dynamoClient = mockClient(DynamoDBDocument).on(PutCommand).rejects({ name: 'ConditionalCheckFailedException' });

      // Act
      let error: unknown;
      try {
        await persistenceLayer._putRecord(record);
      } catch (e){
        error = e;
      }

      // Assess
      expect(dynamoClient).toReceiveCommandWith(PutCommand, {
        TableName: tableName,
        Item: { 'id': key, 'expiration': expiryTimestamp, status: status },
=======
      const dynamoClient = mockClient(DynamoDBDocument).on(PutCommand).rejects({ name: 'ConditionalCheckFailedException' });

      // Act / Assess
      await expect(persistenceLayer._putRecord(record)).rejects.toThrowError(IdempotencyItemAlreadyExistsError);
      expect(dynamoClient).toReceiveCommandWith(PutCommand, {
        TableName: dummyTableName,
        Item: { 'id': dummyKey, 'expiration': expiryTimestamp, status: status },
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        ExpressionAttributeNames: { '#id': 'id', '#expiry': 'expiration', '#status': 'status' },
        ExpressionAttributeValues: { ':now': currentDateInSeconds, ':inprogress': IdempotencyRecordStatus.INPROGRESS },
        ConditionExpression: 'attribute_not_exists(#id) OR #expiry < :now OR NOT #status = :inprogress'
      });
<<<<<<< HEAD
      expect(error).toBeInstanceOf(IdempotencyItemAlreadyExistsError);
    });

    test('when encountering an unknown error, it throws the causing error', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';
=======

    });

    test('when encountering an unknown error, it throws the causing error', async () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.EXPIRED;
      const expiryTimestamp = 0;
      const inProgressExpiryTimestamp = 0;
      const record = new IdempotencyRecord({ 
<<<<<<< HEAD
        idempotencyKey: key, 
=======
        idempotencyKey: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        status, 
        expiryTimestamp, 
        inProgressExpiryTimestamp 
      });
<<<<<<< HEAD

      const dynamoClient = mockClient(DynamoDBDocument).on(PutCommand).rejects(new Error());

      // Act
      let error: unknown;
      try {
        await persistenceLayer._putRecord(record);
      } catch (e){
        error = e;
      }

      // Assess
      expect(dynamoClient).toReceiveCommandWith(PutCommand, {
        TableName: tableName,
        Item: { 'id': key, 'expiration': expiryTimestamp, status: status },
=======
      const dynamoClient = mockClient(DynamoDBDocument).on(PutCommand).rejects(new Error());

      // Act / Assess
      await expect(persistenceLayer._putRecord(record)).rejects.toThrow();
      expect(dynamoClient).toReceiveCommandWith(PutCommand, {
        TableName: dummyTableName,
        Item: { 'id': dummyKey, 'expiration': expiryTimestamp, status: status },
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        ExpressionAttributeNames: { '#id': 'id', '#expiry': 'expiration', '#status': 'status' },
        ExpressionAttributeValues: { ':now': currentDateInSeconds, ':inprogress': IdempotencyRecordStatus.INPROGRESS },
        ConditionExpression: 'attribute_not_exists(#id) OR #expiry < :now OR NOT #status = :inprogress'
      });
<<<<<<< HEAD
      expect(error).toBe(error);
    });
  });

  describe('Method: _getRecord', () => {
    test('when called with a record whose key exists, it gets the correct record', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';

=======

    });

  });

  describe('Method: _getRecord', () => {

    test('when called with a record whose key exists, it gets the correct record', async () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.INPROGRESS;
      const expiryTimestamp = 10;
      const inProgressExpiryTimestamp = 10;
      const responseData = {};
      const dynamoClient = mockClient(DynamoDBDocument).on(GetCommand).resolves({ 
        Item: { 
<<<<<<< HEAD
          id: key, 
=======
          id: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
          status, 
          'expiration': expiryTimestamp, 
          'in_progress_expiry_attr': inProgressExpiryTimestamp, 
          data: responseData 
        } 
      });
      jest.spyOn(Date, 'now').mockReturnValue(0);

      // Act
<<<<<<< HEAD
      const record: IdempotencyRecord = await persistenceLayer._getRecord(key);

      // Assess
      expect(dynamoClient).toReceiveCommandWith(GetCommand, {
        TableName: tableName, 
        Key: { 
          id: key 
=======
      const record: IdempotencyRecord = await persistenceLayer._getRecord(dummyKey);

      // Assess
      expect(dynamoClient).toReceiveCommandWith(GetCommand, {
        TableName: dummyTableName, 
        Key: { 
          id: dummyKey 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        },
        ConsistentRead: true
      });
      expect(record.getStatus()).toEqual(IdempotencyRecordStatus.INPROGRESS);
<<<<<<< HEAD
      expect(record.idempotencyKey).toEqual(key);
=======
      expect(record.idempotencyKey).toEqual(dummyKey);
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      expect(record.inProgressExpiryTimestamp).toEqual(inProgressExpiryTimestamp);
      expect(record.responseData).toEqual(responseData);
      expect(record.expiryTimestamp).toEqual(expiryTimestamp);
    });

    test('when called with a record whose key does not exist, it throws IdempotencyItemNotFoundError', async () => {
<<<<<<< HEAD
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });
  
      const key = 'key';

      const dynamoClient = mockClient(DynamoDBDocument).on(GetCommand).resolves({ Item: undefined });
      jest.spyOn(Date, 'now').mockReturnValue(0);
  
      // Act
      let error: unknown;
      try {
        await persistenceLayer._getRecord(key);
      } catch (e){
        error = e;
      }
  
      // Assess
      expect(dynamoClient).toReceiveCommandWith(GetCommand, {
        TableName: tableName, 
        Key: { 
          id: key 
        },
        ConsistentRead: true
      });
      expect(error).toBeInstanceOf(IdempotencyItemNotFoundError);
    });
  });

  describe('Method: _updateRecord', () => {
    test('when called to update a record, it resolves successfully', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';
=======

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
      const dynamoClient = mockClient(DynamoDBDocument).on(GetCommand).resolves({ Item: undefined });
      jest.spyOn(Date, 'now').mockReturnValue(0);
  
      // Act / Assess
      await expect(persistenceLayer._getRecord(dummyKey)).rejects.toThrowError(IdempotencyItemNotFoundError);
      expect(dynamoClient).toReceiveCommandWith(GetCommand, {
        TableName: dummyTableName, 
        Key: { 
          id: dummyKey 
        },
        ConsistentRead: true
      });

    });

  });

  describe('Method: _updateRecord', () => {

    test('when called to update a record, it resolves successfully', async () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.EXPIRED;
      const expiryTimestamp = 0;
      const inProgressExpiryTimestamp = 0;
      const record = new IdempotencyRecord({
<<<<<<< HEAD
        idempotencyKey: key, 
=======
        idempotencyKey: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        status, 
        expiryTimestamp, 
        inProgressExpiryTimestamp
      });
      const dynamoClient = mockClient(DynamoDBDocument).on(UpdateCommand).resolves({});

      // Act
      await persistenceLayer._updateRecord(record);

      // Assess
      expect(dynamoClient).toReceiveCommandWith(UpdateCommand, {
<<<<<<< HEAD
        TableName: tableName, 
        Key: { id: key },
=======
        TableName: dummyTableName, 
        Key: { id: dummyKey },
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        UpdateExpression: 'SET #status = :status, #expiry = :expiry',
        ExpressionAttributeNames: { '#status': 'status', '#expiry': 'expiration' },
        ExpressionAttributeValues: { ':status': IdempotencyRecordStatus.EXPIRED,':expiry': expiryTimestamp },
      });
<<<<<<< HEAD
    });
  });

  describe('Method: _deleteRecord', () => {
    test('when called with a valid record, record is deleted', async () => {
      // Prepare
      const tableName = 'tableName';
      const persistenceLayer = new TestDynamoPersistenceLayer({ tableName });

      const key = 'key';
=======

    });

  });

  describe('Method: _deleteRecord', () => {

    test('when called with a valid record, record is deleted', async () => {

      // Prepare
      const persistenceLayer = new TestDynamoDBPersistenceLayer({ tableName: dummyTableName });
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
      const status = IdempotencyRecordStatus.EXPIRED;
      const expiryTimestamp = 0;
      const inProgressExpiryTimestamp = 0;
      const record = new IdempotencyRecord({ 
<<<<<<< HEAD
        idempotencyKey: key, 
=======
        idempotencyKey: dummyKey, 
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
        status, 
        expiryTimestamp, 
        inProgressExpiryTimestamp
      });
      const dynamoClient = mockClient(DynamoDBDocument).on(DeleteCommand).resolves({});

      // Act
      await persistenceLayer._deleteRecord(record);

      // Assess
      expect(dynamoClient).toReceiveCommandWith(DeleteCommand, {
<<<<<<< HEAD
        TableName: tableName, 
        Key: { id: key }
      });
    });
  });
=======
        TableName: dummyTableName, 
        Key: { id: dummyKey }
      });

    });

  });

>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
});