// Builds the Express application (middleware + routes).
// server.js is responsible for connecting the database and listening.

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { apiRateLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security headers.
app.use(helmet());

// Only our frontend origins may call this API.
const allowedOrigins = env.clientOrigin.split(",").map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools without an Origin header (curl, Postman).
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Parse JSON bodies, with a small limit (we only ever receive tiny payloads).
app.use(express.json({ limit: "100kb" }));

// Request logging in development.
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Rate limit every API route.
app.use("/api", apiRateLimiter);

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
