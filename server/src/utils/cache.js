// A very small in-memory cache with a time-to-live.
// Purpose: avoid calling TMDB again for the same URL within a few minutes.
// It is intentionally simple: a Map plus an expiry timestamp.

const { env } = require("../config/env");

const store = new Map();

const getFromCache = (key) => {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
};

const saveToCache = (key, value) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + env.cacheTtlSeconds * 1000,
  });
};

const clearCache = () => store.clear();

module.exports = { getFromCache, saveToCache, clearCache };
