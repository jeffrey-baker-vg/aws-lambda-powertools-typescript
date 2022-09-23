class IdempotencyItemNotFoundError extends Error {

}

class IdempotencyInvalidStatusError extends Error {

}

class IdempotencyItemAlreadyExistsError extends Error{

}

export {
  IdempotencyItemNotFoundError,
  IdempotencyInvalidStatusError,
  IdempotencyItemAlreadyExistsError
};