// All MongoDB queries for the wishlist live here.
// Routes and controllers never touch Mongoose directly.

const Wishlist = require("../models/Wishlist");
const ApiError = require("../utils/ApiError");

const getWishlist = async (anonymousUserId) => {
  const items = await Wishlist.find({ anonymousUserId }).sort({ savedAt: -1 }).lean();

  return items.map((item) => ({
    id: item.movieId,
    movieId: item.movieId,
    title: item.title,
    posterUrl: item.posterUrl,
    rating: item.rating,
    releaseDate: item.releaseDate,
    savedAt: item.savedAt,
  }));
};

const addToWishlist = async (movie) => {
  // Check first so the common duplicate case returns a clean 409
  // instead of relying only on the database error.
  const existing = await Wishlist.findOne({
    anonymousUserId: movie.anonymousUserId,
    movieId: movie.movieId,
  });

  if (existing) {
    throw new ApiError(409, "This movie is already in your wishlist");
  }

  const created = await Wishlist.create(movie);

  return {
    id: created.movieId,
    movieId: created.movieId,
    title: created.title,
    posterUrl: created.posterUrl,
    rating: created.rating,
    releaseDate: created.releaseDate,
    savedAt: created.savedAt,
  };
};

const removeFromWishlist = async (anonymousUserId, movieId) => {
  const deleted = await Wishlist.findOneAndDelete({ anonymousUserId, movieId });

  if (!deleted) {
    throw new ApiError(404, "This movie is not in your wishlist");
  }

  return { movieId };
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
