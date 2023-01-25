/**
 * Middleware to count the number of API calls made by the SDK.
 * 
 * The AWS SDK for JavaScript v3 uses a middleware stack to manage the execution of
 * operations. Middleware can be added to the stack to perform custom tasks before
 * or after an operation is executed.
 * 
 * This middleware is added to the stack to count the number of API calls (`ROUND_TRIP`) made by the SDK.
 * This allows us to verify that the SDK is making the expected number of API calls and thus test that
 * caching or forcing a retrieval are working as expected.
 * 
 * @see {@link https://aws.amazon.com/blogs/developer/middleware-stack-modular-aws-sdk-js/|AWS Blog - Middleware Stack}
 */
export const middleware = {
  // 
  counter : 0,
  applyToStack: (stack) => {
    // Middleware added to mark start and end of an complete API call.
    stack.add(
      (next, _context) => async (args) => {
        // Increment counter
        middleware.counter++;

        // Call next middleware
        return await next(args);
      },
      { tags: ['ROUND_TRIP'] }
    );
  },
};