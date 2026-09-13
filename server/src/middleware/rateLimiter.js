// Protects our server (and our TMDB quota) from a client sending
// hundreds of requests per second.

const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMinutes * 60 * 1000,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again in a moment.",
  },
});

module.exports = { apiRateLimiter };
