// Small display helpers. They all guard against missing data so the UI
// never shows "undefined" or "NaN".

export const formatYear = (releaseDate) => {
  if (!releaseDate) return "Year unknown";
  return releaseDate.slice(0, 4);
};

export const formatDate = (releaseDate) => {
  if (!releaseDate) return "Release date unavailable";

  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return "Release date unavailable";

  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export const formatRating = (rating) => {
  if (rating === null || rating === undefined || rating === 0) return "NR";
  return Number(rating).toFixed(1);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "Runtime unavailable";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
};

export const formatMoney = (amount) => {
  if (!amount) return "Not disclosed";
  return "$" + amount.toLocaleString("en-US");
};

export const formatLanguage = (code) => {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};
