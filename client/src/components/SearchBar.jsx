// Controlled search input. The parent owns the value and decides when to
// act on it (the search page debounces it before hitting the API).

const SearchBar = ({ value, onChange, onClear, placeholder = "Search movies..." }) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
      🔍
    </span>

    <label htmlFor="movie-search" className="sr-only">
      Search movies
    </label>

    <input
      id="movie-search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      className="field py-3 pl-10 pr-10"
    />

    {value && (
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-100"
      >
        ✕
      </button>
    )}
  </div>
);

export default SearchBar;
