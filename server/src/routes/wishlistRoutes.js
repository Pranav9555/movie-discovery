const express = require("express");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addToWishlist);
router.delete("/:movieId", wishlistController.removeFromWishlist);

module.exports = router;
