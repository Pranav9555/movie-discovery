// Combines every route group under /api.

const express = require("express");
const movieRoutes = require("./movieRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const { getDatabaseStatus } = require("../config/db");

const router = express.Router();

// GET /api/health - quick way to confirm the server and database are alive.
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      database: getDatabaseStatus(),
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

router.use("/movies", movieRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
