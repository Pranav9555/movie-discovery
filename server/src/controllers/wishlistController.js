const wishlistService = require("../services/wishlistService");
const asyncHandler = require("../utils/asyncHandler");
const {
  parseMovieId,
  requireAnonymousUserId,
  parseWishlistBody,
} = require("../middleware/validate");

// GET /api/wishlist?anonymousUserId=...
const getWishlist = asyncHandler(async (req, res) => {
  const anonymousUserId = requireAnonymousUserId(req.query.anonymousUserId);
  const items = await wishlistService.getWishlist(anonymousUserId);

  res.status(200).json({ success: true, data: { items, count: items.length } });
});

// POST /api/wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const movie = parseWishlistBody(req.body);
  const saved = await wishlistService.addToWishlist(movie);

  res.status(201).json({ success: true, data: saved });
});

// DELETE /api/wishlist/:movieId?anonymousUserId=...
const removeFromWishlist = asyncHandler(async (req, res) => {
  const movieId = parseMovieId(req.params.movieId);
  // Accept the id from the query string or the body, whichever the client sent.
  const anonymousUserId = requireAnonymousUserId(
    req.query.anonymousUserId || (req.body && req.body.anonymousUserId)
  );

  const removed = await wishlistService.removeFromWishlist(anonymousUserId, movieId);

  res.status(200).json({ success: true, data: removed, message: "Removed from wishlist" });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
