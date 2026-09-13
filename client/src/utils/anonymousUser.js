// The assignment does not require authentication.
// Instead every browser gets a random id stored in localStorage.
// That id is sent with wishlist requests so each browser has its own list.
//
// Limitation: the wishlist is tied to this browser. Clearing site data
// or using another device means a different (empty) wishlist.

const STORAGE_KEY = "anonymousUserId";

// crypto.randomUUID exists in all modern browsers; the fallback keeps
// the app working on older ones and over plain http.
const createId = () => {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "user-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
};

export const getAnonymousUserId = () => {
  let id = localStorage.getItem(STORAGE_KEY);

  if (!id) {
    id = createId();
    localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
};
