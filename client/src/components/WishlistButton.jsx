// A heart button that adds/removes a movie.
// Used on cards (small) and on the details page (large).

import { useWishlist } from "../context/WishlistContext";
import { Spinner } from "./Loader";

const WishlistButton = ({ movie, variant = "icon" }) => {
  const { isSaved, isPending, toggleWishlist } = useWishlist();

  const saved = isSaved(movie.id);
  const pending = isPending(movie.id);
  const label = saved ? `Remove ${movie.title} from wishlist` : `Add ${movie.title} to wishlist`;

  const handleClick = (event) => {
    // The card is wrapped in a link, so stop the click from navigating.
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(movie);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={label}
        className={saved ? "btn-ghost" : "btn-primary"}
      >
        {pending ? <Spinner label="Saving" /> : <span aria-hidden="true">{saved ? "♥" : "♡"}</span>}
        {saved ? "In your wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 backdrop-blur transition-colors ${
        saved ? "bg-gold text-night" : "bg-night/70 text-white hover:bg-night"
      }`}
    >
      {pending ? <Spinner label="Saving" /> : <span aria-hidden="true">{saved ? "♥" : "♡"}</span>}
    </button>
  );
};

export default WishlistButton;
