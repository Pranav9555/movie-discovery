// Wishlist calls. The anonymous user id is attached here so components
// never have to think about it.

import api from "./api";
import { getAnonymousUserId } from "../utils/anonymousUser";

export const fetchWishlist = async () => {
  const response = await api.get("/wishlist", {
    params: { anonymousUserId: getAnonymousUserId() },
  });
  return response.data.data.items;
};

// `movie` may be a full movie object or a card-sized one; we only send
// the five snapshot fields the backend stores.
export const addWishlistItem = async (movie) => {
  const response = await api.post("/wishlist", {
    anonymousUserId: getAnonymousUserId(),
    movieId: movie.id,
    title: movie.title,
    posterUrl: movie.posterUrl,
    rating: movie.rating,
    releaseDate: movie.releaseDate,
  });
  return response.data.data;
};

export const removeWishlistItem = async (movieId) => {
  const response = await api.delete(`/wishlist/${movieId}`, {
    params: { anonymousUserId: getAnonymousUserId() },
  });
  return response.data.data;
};
