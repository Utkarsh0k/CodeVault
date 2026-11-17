// Express 4 does not catch errors thrown inside async functions.
// This wrapper forwards any error to Express's error handler via next(error),
// so controllers don't need a try/catch in every function.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};