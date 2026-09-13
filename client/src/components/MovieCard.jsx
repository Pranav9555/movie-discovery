import { Link, useLocation } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import { formatRating, formatYear } from "../utils/format";

// One poster tile. The whole card is a link to the details page.
// We pass the current location in router state so the details page can
// offer a "Back to results" link that keeps the search query and page.
const MovieCard = ({ movie }) => {
  const location = useLocation();

  return (
    <article className="group relative">
      <WishlistButton movie={movie} />

      <Link
        to={`/movie/${movie.id}`}
        state={{ from: location.pathname + location.search }}
        className="block focus:outline-none"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-edge bg-surface">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={`Poster for ${movie.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-muted">
              <span className="text-2xl" aria-hidden="true">
                🎞️
              </span>
              <span className="text-xs">No poster available</span>
            </div>
          )}

          <span className="absolute bottom-2 left-2 rounded-md bg-night/85 px-2 py-1 text-xs font-semibold text-gold">
            ★ {formatRating(movie.rating)}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug group-hover:text-gold">
          {movie.title}
        </h3>
        <p className="mt-0.5 text-xs text-muted">{formatYear(movie.releaseDate)}</p>
      </Link>
    </article>
  );
};

export default MovieCard;
