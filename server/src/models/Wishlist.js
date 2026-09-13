// Mongoose model for a saved (wishlisted) movie.
// We store a small snapshot of the movie so the wishlist page can be
// rendered from MongoDB alone, without one TMDB call per saved movie.

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    anonymousUserId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterUrl: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    releaseDate: {
      type: String,
      default: null,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// One movie can only be saved once per anonymous user.
// A second POST for the same movie throws a duplicate key error (code 11000),
// which the error middleware converts into HTTP 409.
wishlistSchema.index({ anonymousUserId: 1, movieId: 1 }, { unique: true });

// Supports "get my wishlist, newest first" with a single index scan.
wishlistSchema.index({ anonymousUserId: 1, savedAt: -1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);
