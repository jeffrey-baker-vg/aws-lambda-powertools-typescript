class IdempotencyItemNotFoundError extends Error {

}

class IdempotencyItemAlreadyExistsError extends Error{

}

class IdempotencyInvalidStatusError extends Error {

}

<<<<<<< HEAD
class IdempotencyInconsistentStateError extends Error {

}

class IdempotencyAlreadyInProgressError extends Error {

}

class IdempotencyPersistenceLayerError extends Error {

}

export {
  IdempotencyItemNotFoundError,
  IdempotencyItemAlreadyExistsError,
  IdempotencyInvalidStatusError,
  IdempotencyInconsistentStateError,
  IdempotencyAlreadyInProgressError,
  IdempotencyPersistenceLayerError
=======
export {
  IdempotencyItemNotFoundError,
  IdempotencyItemAlreadyExistsError,
  IdempotencyInvalidStatusError
>>>>>>> 0991021a5c0e5b49bc02a36130adfac8151dd2cc
};