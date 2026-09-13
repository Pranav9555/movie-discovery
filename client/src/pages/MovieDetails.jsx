// Movie details page.
// "Back to results" uses the location we stored in router state when the
// card was clicked, so returning to /search?query=batman&page=2 keeps context.

import { useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import WishlistButton from "../components/WishlistButton";
import ErrorMessage from "../components/ErrorMessage";
import { Spinner } from "../components/Loader";
import { useMovies } from "../hooks/useMovies";
import { getMovieById } from "../services/movieApi";
import {
  formatDate,
  formatLanguage,
  formatMoney,
  formatRating,
  formatRuntime,
} from "../utils/format";

const Fact = ({ label, value }) => (
  <div>
    <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
    <dd className="mt-0.5 text-sm font-medium">{value}</dd>
  </div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const backTo = (location.state && location.state.from) || null;

  const fetcher = useCallback((signal) => getMovieById(id, signal), [id]);
  const { data: movie, isLoading, error, reload } = useMovies(fetcher, [id]);

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center gap-3 text-muted">
        <Spinner label="Loading movie" />
        Loading movie details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorMessage message={error} onRetry={reload} />
        <div className="mt-4 text-center">
          <Link to="/" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <article className="pb-8">
      <div className="relative">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/90 to-night/60" />

        <div className="container-page relative py-8">
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="btn-ghost mb-6"
          >
            ← {backTo && backTo.startsWith("/search") ? "Back to results" : "Back"}
          </button>

          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-44 shrink-0 sm:w-56">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={`Poster for ${movie.title}`}
                  className="w-full rounded-xl border border-edge object-cover shadow-2xl"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl border border-edge bg-surface text-center text-sm text-muted">
                  No poster available
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{movie.title}</h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="mt-1 text-sm text-muted">Original title: {movie.originalTitle}</p>
              )}

              {movie.tagline && <p className="mt-2 italic text-gold">{movie.tagline}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-md bg-gold px-2 py-1 font-bold text-night">
                  ★ {formatRating(movie.rating)}
                </span>
                <span className="text-muted">{movie.voteCount.toLocaleString()} votes</span>
                <span className="text-muted">·</span>
                <span>{formatDate(movie.releaseDate)}</span>
                <span className="text-muted">·</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>

              {movie.genres.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <li key={genre.id}>
                      <Link
                        to={`/search?genre=${genre.id}&page=1`}
                        className="rounded-full border border-edge bg-surface px-3 py-1 text-xs hover:bg-surfaceHover"
                      >
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <h2 className="mt-6 text-lg font-semibold">Overview</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
                {movie.overview || "No overview available for this movie."}
              </p>

              <div className="mt-6">
                <WishlistButton movie={movie} variant="full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page mt-10">
        <h2 className="section-title">Details</h2>
        <dl className="card-surface mt-4 grid grid-cols-2 gap-5 p-5 sm:grid-cols-3 lg:grid-cols-4">
          <Fact label="Status" value={movie.status || "Unknown"} />
          <Fact label="Language" value={formatLanguage(movie.language)} />
          <Fact label="Runtime" value={formatRuntime(movie.runtime)} />
          <Fact
            label="Popularity"
            value={movie.popularity ? Math.round(movie.popularity).toLocaleString() : "Unavailable"}
          />
          <Fact label="Budget" value={formatMoney(movie.budget)} />
          <Fact label="Revenue" value={formatMoney(movie.revenue)} />
        </dl>

        {movie.productionCompanies.length > 0 && (
          <>
            <h2 className="section-title mt-10">Production companies</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {movie.productionCompanies.map((company) => (
                <li
                  key={company.id}
                  className="card-surface flex items-center gap-3 px-4 py-3 text-sm"
                >
                  {company.logoUrl && (
                    <img
                      src={company.logoUrl}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-6 w-auto bg-white/90 p-0.5"
                    />
                  )}
                  {company.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
};

export default MovieDetails;
