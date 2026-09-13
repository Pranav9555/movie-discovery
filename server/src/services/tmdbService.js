// Everything that talks to TMDB lives here.
// Controllers never call axios directly.

const axios = require("axios");
const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");
const { getFromCache, saveToCache } = require("../utils/cache");
const { normalizeMovieList, normalizeMovieDetails } = require("../utils/normalize");

// One axios instance with the base URL and the API key already attached.
const tmdbClient = axios.create({
  baseURL: env.tmdbBaseUrl,
  timeout: 10000,
});

// Shared helper: cache lookup -> TMDB request -> readable errors.
const requestTmdb = async (path, params = {}) => {
  if (!env.tmdbApiKey) {
    throw new ApiError(500, "TMDB API key is not configured on the server");
  }

  const query = { api_key: env.tmdbApiKey, language: "en-US", ...params };
  const cacheKey = `${path}?${JSON.stringify(query)}`;

  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await tmdbClient.get(path, { params: query });
    saveToCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    // Turn axios noise into a clean ApiError.
    if (error.response) {
      const status = error.response.status;
      if (status === 404) throw new ApiError(404, "Movie not found on TMDB");
      if (status === 401) throw new ApiError(500, "Invalid TMDB API key");
      if (status === 429) throw new ApiError(429, "TMDB rate limit reached, please try again shortly");
      throw new ApiError(502, "TMDB returned an unexpected error");
    }
    if (error.code === "ECONNABORTED") {
      throw new ApiError(504, "TMDB request timed out");
    }
    throw new ApiError(502, "Could not reach TMDB");
  }
};

const fetchTrending = async (page) => {
  const data = await requestTmdb("/trending/movie/day", { page });
  return normalizeMovieList(data);
};

const fetchPopular = async (page) => {
  const data = await requestTmdb("/movie/popular", { page });
  return normalizeMovieList(data);
};

const fetchTopRated = async (page) => {
  const data = await requestTmdb("/movie/top_rated", { page });
  return normalizeMovieList(data);
};

const fetchUpcoming = async (page) => {
  const data = await requestTmdb("/movie/upcoming", { page });
  return normalizeMovieList(data);
};

const searchMovies = async (query, page) => {
  const data = await requestTmdb("/search/movie", { query, page, include_adult: false });
  return normalizeMovieList(data);
};

// Maps our simple sort names to the values TMDB expects.
const sortMap = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  release: "primary_release_date.desc",
  oldest: "primary_release_date.asc",
  title: "title.asc",
};

const discoverMovies = async ({ genre, year, sort, page }) => {
  const params = {
    page,
    include_adult: false,
    sort_by: sortMap[sort] || sortMap.popularity,
  };

  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;

  // Sorting by rating without a vote threshold surfaces films with 1 vote
  // and a perfect score, which looks broken. This keeps results sensible.
  if (sort === "rating") params["vote_count.gte"] = 200;

  const data = await requestTmdb("/discover/movie", params);
  return normalizeMovieList(data);
};

const fetchMovieById = async (id) => {
  const data = await requestTmdb(`/movie/${id}`);
  return normalizeMovieDetails(data);
};

const fetchGenres = async () => {
  const data = await requestTmdb("/genre/movie/list");
  return Array.isArray(data.genres) ? data.genres : [];
};

module.exports = {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  fetchUpcoming,
  searchMovies,
  discoverMovies,
  fetchMovieById,
  fetchGenres,
};
