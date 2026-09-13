// One shared axios instance pointing at OUR Express backend.
// The frontend never calls TMDB directly and never sees the TMDB key.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Turns any axios failure into a plain Error with a message we can show.
export const getErrorMessage = (error) => {
  if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
    return null; // A cancelled request is not a real error.
  }
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }
  if (error.message === "Network Error") {
    return "Cannot reach the server. Is the backend running on port 5000?";
  }
  return "Something went wrong. Please try again.";
};

export default api;
