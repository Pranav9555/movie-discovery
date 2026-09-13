// All movie-related calls to our backend.
// Each function accepts an optional AbortSignal so the caller can cancel
// an in-flight request (used by the search page).

import api from "./api";

const getList = async (path, params, signal) => {
  const response = await api.get(path, { params, signal });
  return response.data.data;
};

export const getTrending = (page = 1, signal) =>
  getList("/movies/trending", { page }, signal);

export const getPopular = (page = 1, signal) => getList("/movies/popular", { page }, signal);

export const getTopRated = (page = 1, signal) => getList("/movies/top-rated", { page }, signal);

export const getUpcoming = (page = 1, signal) => getList("/movies/upcoming", { page }, signal);

export const searchMovies = (query, page = 1, signal) =>
  getList("/movies/search", { query, page }, signal);

export const discoverMovies = (filters, signal) =>
  getList(
    "/movies/discover",
    {
      genre: filters.genre || undefined,
      year: filters.year || undefined,
      sort: filters.sort || "popularity",
      page: filters.page || 1,
    },
    signal
  );

export const getGenres = async (signal) => {
  const data = await getList("/movies/genres", {}, signal);
  return data.genres;
};

export const getMovieById = async (id, signal) => {
  const response = await api.get(`/movies/${id}`, { signal });
  return response.data.data;
};
