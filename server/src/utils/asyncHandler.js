// Wraps an async controller so a rejected promise is passed to next()
// instead of crashing the process. Saves a try/catch in every controller.

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
