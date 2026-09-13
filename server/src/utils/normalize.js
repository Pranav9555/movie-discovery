// Converts raw TMDB payloads into the shape our frontend expects.
// Doing this on the backend means the React code never deals with
// TMDB naming (poster_path, vote_average, ...) or with missing fields.

const { env } = require("../config/env");

// Builds a full image URL, or null when TMDB has no image.
const buildImageUrl = (path, size) => {
  if (!path) return null;
  return `${env.tmdbImageBaseUrl}/${size}${path}`;
};

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name || "Untitled",
  originalTitle: movie.original_title || null,
  overview: movie.overview || "",
  posterUrl: buildImageUrl(movie.poster_path, "w500"),
  backdropUrl: buildImageUrl(movie.backdrop_path, "w1280"),
  rating: typeof movie.vote_average === "number" ? Number(movie.vote_average.toFixed(1)) : null,
  voteCount: movie.vote_count ?? 0,
  releaseDate: movie.release_date || null,
  popularity: movie.popularity ?? null,
  genreIds: Array.isArray(movie.genre_ids) ? movie.genre_ids : [],
  language: movie.original_language || null,
});

// TMDB list endpoints all return { page, results, total_pages, total_results }.
const normalizeMovieList = (data) => ({
  page: data.page || 1,
  // TMDB refuses page numbers above 500, so we never advertise more than that.
  totalPages: Math.min(data.total_pages || 1, 500),
  totalResults: data.total_results || 0,
  results: Array.isArray(data.results) ? data.results.map(normalizeMovie) : [],
});

// The /movie/:id endpoint returns extra fields.
const normalizeMovieDetails = (movie) => ({
  ...normalizeMovie(movie),
  runtime: movie.runtime || null,
  status: movie.status || null,
  tagline: movie.tagline || null,
  homepage: movie.homepage || null,
  budget: movie.budget || 0,
  revenue: movie.revenue || 0,
  genres: Array.isArray(movie.genres) ? movie.genres.map((g) => ({ id: g.id, name: g.name })) : [],
  productionCompanies: Array.isArray(movie.production_companies)
    ? movie.production_companies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: buildImageUrl(c.logo_path, "w185"),
      }))
    : [],
});

module.exports = { normalizeMovie, normalizeMovieList, normalizeMovieDetails, buildImageUrl };
