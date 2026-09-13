// A horizontally scrolling row of movies, used on the home page.

import MovieCard from "./MovieCard";
import { CardSkeleton } from "./Loader";
import ErrorMessage from "./ErrorMessage";

const MovieRow = ({ title, subtitle, movies, isLoading, error, onRetry }) => (
  <section className="mt-12">
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
    </div>

    {error ? (
      <ErrorMessage message={error} onRetry={onRetry} />
    ) : (
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-36 shrink-0 snap-start sm:w-40 md:w-44">
                <CardSkeleton />
              </div>
            ))
          : movies.map((movie) => (
              <div key={movie.id} className="w-36 shrink-0 snap-start sm:w-40 md:w-44">
                <MovieCard movie={movie} />
              </div>
            ))}
      </div>
    )}
  </section>
);

export default MovieRow;
