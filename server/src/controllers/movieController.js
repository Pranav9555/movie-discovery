// Controllers: read the request, validate it, call a service, send a response.
// No axios and no business logic here.

const tmdbService = require("../services/tmdbService");
const asyncHandler = require("../utils/asyncHandler");
const { parsePage, parseMovieId, requireQueryString } = require("../middleware/validate");

const sendOk = (res, data) => res.status(200).json({ success: true, data });

const getTrending = asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page);
  sendOk(res, await tmdbService.fetchTrending(page));
});

const getPopular = asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page);
  sendOk(res, await tmdbService.fetchPopular(page));
});

const getTopRated = asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page);
  sendOk(res, await tmdbService.fetchTopRated(page));
});

const getUpcoming = asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page);
  sendOk(res, await tmdbService.fetchUpcoming(page));
});

const searchMovies = asyncHandler(async (req, res) => {
  const query = requireQueryString(req.query.query);
  const page = parsePage(req.query.page);
  sendOk(res, await tmdbService.searchMovies(query, page));
});

const discoverMovies = asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page);
  sendOk(
    res,
    await tmdbService.discoverMovies({
      genre: req.query.genre || "",
      year: req.query.year || "",
      sort: req.query.sort || "popularity",
      page,
    })
  );
});

const getGenres = asyncHandler(async (req, res) => {
  sendOk(res, { genres: await tmdbService.fetchGenres() });
});

const getMovieById = asyncHandler(async (req, res) => {
  const id = parseMovieId(req.params.id);
  sendOk(res, await tmdbService.fetchMovieById(id));
});

module.exports = {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  discoverMovies,
  getGenres,
  getMovieById,
};
