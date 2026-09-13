// Home / discovery page: a hero plus four horizontally scrolling rows.
// Each row fetches its own list, so one failing row does not break the page.

import { useCallback } from "react";
import { Link } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import { useMovies } from "../hooks/useMovies";
import {
  getPopular,
  getTopRated,
  getTrending,
  getUpcoming,
} from "../services/movieApi";
import { formatRating, formatYear } from "../utils/format";

const Home = () => {
  // useCallback keeps the fetcher identity stable so the hook does not re-run.
  const trendingFetcher = useCallback((signal) => getTrending(1, signal), []);
  const popularFetcher = useCallback((signal) => getPopular(1, signal), []);
  const topRatedFetcher = useCallback((signal) => getTopRated(1, signal), []);
  const upcomingFetcher = useCallback((signal) => getUpcoming(1, signal), []);

  const trending = useMovies(trendingFetcher, []);
  const popular = useMovies(popularFetcher, []);
  const topRated = useMovies(topRatedFetcher, []);
  const upcoming = useMovies(upcomingFetcher, []);

  // The first trending movie becomes the hero banner.
  const hero = trending.data && trending.data.results[0];

  return (
    <div className="container-page pb-8">
      <section className="relative mt-6 overflow-hidden rounded-2xl border border-edge">
        {hero && hero.backdropUrl && (
          <img
            src={hero.backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Overlay keeps the text readable on top of any backdrop. */}
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/90 to-night/40" />

        <div className="relative px-6 py-14 sm:px-10 sm:py-20 lg:max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Trending today
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            {hero ? hero.title : "Find your next favourite movie"}
          </h1>
          <p className="mt-3 line-clamp-2 text-sm text-slate-300 sm:text-base">
            {hero && hero.overview
              ? hero.overview
              : "Browse what's trending, filter by genre and year, and build a wishlist that stays with you."}
          </p>

          {hero && (
            <p className="mt-3 text-sm text-muted">
              ★ {formatRating(hero.rating)} · {formatYear(hero.releaseDate)}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {hero && (
              <Link to={`/movie/${hero.id}`} className="btn-primary">
                View details
              </Link>
            )}
            <Link to="/search" className="btn-ghost">
              Browse all movies
            </Link>
          </div>
        </div>
      </section>

      <MovieRow
        title="Trending today"
        subtitle="What everyone is watching right now"
        movies={trending.data ? trending.data.results : []}
        isLoading={trending.isLoading}
        error={trending.error}
        onRetry={trending.reload}
      />

      <MovieRow
        title="Popular movies"
        subtitle="Consistently loved by audiences"
        movies={popular.data ? popular.data.results : []}
        isLoading={popular.isLoading}
        error={popular.error}
        onRetry={popular.reload}
      />

      <MovieRow
        title="Top rated"
        subtitle="The highest scoring films of all time"
        movies={topRated.data ? topRated.data.results : []}
        isLoading={topRated.isLoading}
        error={topRated.error}
        onRetry={topRated.reload}
      />

      <MovieRow
        title="Upcoming"
        subtitle="Coming soon to cinemas"
        movies={upcoming.data ? upcoming.data.results : []}
        isLoading={upcoming.isLoading}
        error={upcoming.error}
        onRetry={upcoming.reload}
      />
    </div>
  );
};

export default Home;
