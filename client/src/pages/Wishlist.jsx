// The wishlist page reads straight from MongoDB through our API.
// Because we saved a snapshot of each movie, no TMDB call is needed here.

import { Link } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { GridSkeleton } from "../components/Loader";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { items, count, isLoading, error, reload } = useWishlist();

  // The grid expects `id`; wishlist rows already expose both id and movieId.
  const movies = items.map((item) => ({
    id: item.movieId,
    title: item.title,
    posterUrl: item.posterUrl,
    rating: item.rating,
    releaseDate: item.releaseDate,
    genreIds: [],
  }));

  return (
    <div className="container-page pb-8 pt-8">
      <h1 className="section-title">Your wishlist</h1>
      <p className="mt-1 text-sm text-muted">
        {count > 0
          ? `${count} saved ${count === 1 ? "movie" : "movies"}. Saved in the database, so it survives a refresh.`
          : "Movies you save are stored in the database and stay here between visits."}
      </p>

      <div className="mt-8">
        {isLoading && <GridSkeleton count={6} />}

        {!isLoading && error && <ErrorMessage message={error} onRetry={reload} />}

        {!isLoading && !error && count === 0 && (
          <EmptyState
            icon="💛"
            title="Nothing saved yet"
            description="Tap the heart on any movie to keep it here for later."
            action={
              <Link to="/" className="btn-primary">
                Discover movies
              </Link>
            }
          />
        )}

        {!isLoading && !error && count > 0 && <MovieGrid movies={movies} />}
      </div>

      {count > 0 && (
        <p className="mt-10 text-center text-xs text-muted">
          Note: this wishlist belongs to this browser. Clearing site data or using another device
          starts a new, empty list.
        </p>
      )}
    </div>
  );
};

export default Wishlist;
