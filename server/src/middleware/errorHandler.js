// The single place where errors become JSON responses.
// Express recognises this as an error handler because it has 4 arguments.

const { env } = require("../config/env");

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  // MongoDB duplicate key (compound unique index on anonymousUserId + movieId)
  if (error.code === 11000) {
    statusCode = 409;
    message = "This movie is already in your wishlist";
  }

  // Mongoose schema validation failure
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Bad ObjectId / wrong type
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid value provided";
  }

  if (statusCode >= 500) {
    console.error("[error]", error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack traces only in development, never in production.
    ...(env.nodeEnv === "development" ? { stack: error.stack } : {}),
  });
};

module.exports = errorHandler;
