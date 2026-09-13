const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

// Specific paths must come before "/:id", otherwise Express would treat
// "popular" as a movie id.
router.get("/trending", movieController.getTrending);
router.get("/popular", movieController.getPopular);
router.get("/top-rated", movieController.getTopRated);
router.get("/upcoming", movieController.getUpcoming);
router.get("/search", movieController.searchMovies);
router.get("/discover", movieController.discoverMovies);
router.get("/genres", movieController.getGenres);
router.get("/:id", movieController.getMovieById);

module.exports = router;
