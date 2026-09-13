// Loads environment variables once and exposes them as a plain object.
// Keeping this in one file means no other file needs to touch process.env.

const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/movie-discovery",
  tmdbApiKey: process.env.TMDB_API_KEY || "",
  tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  tmdbImageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 300,
  rateLimitWindowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 1,
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};

// Fail loudly at startup instead of mysteriously at request time.
const checkRequiredEnv = () => {
  if (!env.tmdbApiKey) {
    console.warn(
      "[env] TMDB_API_KEY is missing. Movie endpoints will return 500 until you set it in server/.env"
    );
  }
};

module.exports = { env, checkRequiredEnv };
