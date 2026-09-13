// Search + browse page.
//
// The URL is the single source of truth: /search?query=batman&page=2&genre=28
// That makes results shareable, makes the back button work, and means the
// search context survives a trip to a movie details page.
//
// Two modes:
//  - a query is present  -> /api/movies/search
//  - no query            -> /api/movies/discover (genre / year / sort browsing)

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { GridSkeleton } from "../components/Loader";
import { useDebounce } from "../hooks/useDebounce";
import { useMovies } from "../hooks/useMovies";
import { discoverMovies, getGenres, searchMovies } from "../services/movieApi";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Values read from the URL.
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page") || 1);
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const sort = searchParams.get("sort") || "popularity";

  // The input is local state so typing feels instant.
  const [inputValue, setInputValue] = useState(query);
  const debouncedInput = useDebounce(inputValue, 500);

  const [genres, setGenres] = useState([]);

  // Load the genre list once for the filter dropdown.
  useEffect(() => {
    const controller = new AbortController();
    getGenres(controller.signal)
      .then(setGenres)
      .catch(() => setGenres([])); // A missing genre list must not break search.
    return () => controller.abort();
  }, []);

  // Keep the input in sync when the URL changes from elsewhere
  // (navbar quick search, browser back button).
  useEffect(() => {
    setInputValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // When the debounced text differs from the URL, write it to the URL
  // and go back to page 1. This is what actually triggers a new request.
  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed === query) return;

    const next = new URLSearchParams(searchParams);
    if (trimmed) next.set("query", trimmed);
    else next.delete("query");
    next.set("page", "1");

    // replace: true so each keystroke does not add a history entry.
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const isSearching = query.length > 0;

  const fetcher = useCallback(
    (signal) =>
      isSearching
        ? searchMovies(query, page, signal)
        : discoverMovies({ genre, year, sort, page }, signal),
    [isSearching, query, page, genre, year, sort]
  );

  const { data, isLoading, isRefreshing, error, reload } = useMovies(fetcher, [
    isSearching,
    query,
    page,
    genre,
    year,
    sort,
  ]);

  // Changing a filter always resets to page 1 and keeps the other filters.
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const resetFilters = () => {
    const next = new URLSearchParams();
    if (query) next.set("query", query);
    next.set("page", "1");
    setSearchParams(next);
  };

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const clearSearch = () => {
    setInputValue("");
    const next = new URLSearchParams(searchParams);
    next.delete("query");
    next.set("page", "1");
    setSearchParams(next);
  };

  // When searching, TMDB cannot combine a text query with filters,
  // so we narrow the returned results on the client instead.
  const visibleMovies = (() => {
    if (!data) return [];
    if (!isSearching) return data.results;

    return data.results.filter((movie) => {
      const matchesGenre = !genre || movie.genreIds.includes(Number(genre));
      const matchesYear = !year || (movie.releaseDate || "").startsWith(year);
      return matchesGenre && matchesYear;
    });
  })();

  return (
    <div className="container-page pb-8 pt-8">
      <h1 className="section-title">{isSearching ? `Results for "${query}"` : "Browse movies"}</h1>
      <p className="mt-1 text-sm text-muted">
        {isSearching
          ? "Search across the entire TMDB catalogue."
          : "Filter by genre and year, then sort the results however you like."}
      </p>

      <div className="mt-6 space-y-4">
        <SearchBar value={inputValue} onChange={setInputValue} onClear={clearSearch} />

        <FilterBar
          genres={genres}
          filters={{ genre, year, sort }}
          onChange={updateParam}
          onReset={resetFilters}
          // Sorting search results is TMDB-controlled by relevance, so we
          // only offer sorting while browsing.
          showSort={!isSearching}
        />
      </div>

      <div className="mt-8">
        {isLoading && <GridSkeleton />}

        {!isLoading && error && <ErrorMessage message={error} onRetry={reload} />}

        {!isLoading && !error && visibleMovies.length === 0 && (
          <EmptyState
            icon="🔍"
            title={isSearching ? "No movies matched your search" : "No movies matched these filters"}
            description={
              isSearching
                ? "Try a different spelling, a shorter title, or clear your filters."
                : "Try widening the year range or picking another genre."
            }
            action={
              <button type="button" onClick={resetFilters} className="btn-primary">
                Clear filters
              </button>
            }
          />
        )}

        {!isLoading && !error && visibleMovies.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted">
              {data.totalResults.toLocaleString()} movies found
            </p>
            <MovieGrid movies={visibleMovies} isRefreshing={isRefreshing} />
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={changePage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
