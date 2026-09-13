// Small hand-written validation helpers.
// No validation library: the rules are few and easy to read.

const ApiError = require("../utils/ApiError");

// TMDB allows pages 1..500 only.
const parsePage = (value) => {
  const page = Number(value || 1);
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    throw new ApiError(400, "Page must be a whole number between 1 and 500");
  }
  return page;
};

const parseMovieId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Movie id must be a positive whole number");
  }
  return id;
};

const requireQueryString = (value) => {
  const query = String(value || "").trim();
  if (!query) {
    throw new ApiError(400, "A search query is required");
  }
  if (query.length > 100) {
    throw new ApiError(400, "Search query is too long");
  }
  return query;
};

const requireAnonymousUserId = (value) => {
  const id = String(value || "").trim();
  if (!id) {
    throw new ApiError(400, "anonymousUserId is required");
  }
  if (id.length > 100) {
    throw new ApiError(400, "anonymousUserId is not valid");
  }
  return id;
};

// Validates the body of POST /api/wishlist and returns a clean object.
const parseWishlistBody = (body) => {
  const anonymousUserId = requireAnonymousUserId(body.anonymousUserId);
  const movieId = parseMovieId(body.movieId);

  const title = String(body.title || "").trim();
  if (!title) {
    throw new ApiError(400, "Movie title is required");
  }

  let rating = null;
  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    rating = Number(body.rating);
    if (Number.isNaN(rating)) {
      throw new ApiError(400, "Rating must be a number");
    }
  }

  return {
    anonymousUserId,
    movieId,
    title: title.slice(0, 300),
    posterUrl: body.posterUrl ? String(body.posterUrl) : null,
    rating,
    releaseDate: body.releaseDate ? String(body.releaseDate) : null,
  };
};

module.exports = {
  parsePage,
  parseMovieId,
  requireQueryString,
  requireAnonymousUserId,
  parseWishlistBody,
};
