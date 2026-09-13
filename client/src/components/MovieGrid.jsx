import MovieCard from "./MovieCard";

// A responsive grid of movie cards.
// `isRefreshing` dims the grid while the next page loads, instead of
// replacing the results with a skeleton (less flicker).
const MovieGrid = ({ movies, isRefreshing = false }) => (
  <div
    className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${
      isRefreshing ? "opacity-50" : "opacity-100"
    }`}
    aria-busy={isRefreshing}
  >
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
);

export default MovieGrid;
