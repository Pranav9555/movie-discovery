// The wishlist is the only piece of state shared across pages
// (the navbar badge, every movie card, and the wishlist page all need it),
// so it lives in a small React Context. No Redux needed.
//
// MongoDB is the source of truth. localStorage only holds the anonymous id.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addWishlistItem, fetchWishlist, removeWishlistItem } from "../services/wishlistApi";
import { getErrorMessage } from "../services/api";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Ids currently being added/removed, so a card can show a spinner
  // and we can ignore double clicks.
  const [pendingIds, setPendingIds] = useState([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchWishlist());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load the saved movies once when the app starts.
  useEffect(() => {
    load();
  }, [load]);

  // A Set makes "is this movie saved?" an O(1) check inside every card.
  const savedIds = useMemo(() => new Set(items.map((item) => item.movieId)), [items]);

  const isSaved = useCallback((movieId) => savedIds.has(movieId), [savedIds]);

  const isPending = useCallback((movieId) => pendingIds.includes(movieId), [pendingIds]);

  const toggleWishlist = useCallback(
    async (movie) => {
      const movieId = movie.id;
      if (pendingIds.includes(movieId)) return;

      setPendingIds((ids) => [...ids, movieId]);
      setError(null);

      const wasSaved = savedIds.has(movieId);

      try {
        if (wasSaved) {
          await removeWishlistItem(movieId);
          setItems((current) => current.filter((item) => item.movieId !== movieId));
        } else {
          const saved = await addWishlistItem(movie);
          setItems((current) => [saved, ...current]);
        }
      } catch (err) {
        // 409 means it is already saved (e.g. two tabs open) - just resync.
        if (err.response && err.response.status === 409) {
          await load();
        } else {
          setError(getErrorMessage(err));
        }
      } finally {
        setPendingIds((ids) => ids.filter((id) => id !== movieId));
      }
    },
    [pendingIds, savedIds, load]
  );

  const value = {
    items,
    count: items.length,
    isLoading,
    error,
    isSaved,
    isPending,
    toggleWishlist,
    reload: load,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook so components write `useWishlist()` instead of useContext(...).
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside a WishlistProvider");
  }
  return context;
};
