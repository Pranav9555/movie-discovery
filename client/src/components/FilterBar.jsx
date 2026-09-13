// Genre / year / sort controls.
// This component is "dumb": it reports changes upward and the page decides
// what to do (in practice: write the change into the URL and reset to page 1).

const SORT_OPTIONS = [
  { value: "popularity", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "release", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title (A–Z)" },
];

// Years from next year back to 1950.
const buildYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1950; year -= 1) years.push(year);
  return years;
};

const FilterBar = ({ genres, filters, onChange, onReset, showSort = true }) => {
  const years = buildYears();
  const hasActiveFilter = Boolean(filters.genre || filters.year) || filters.sort !== "popularity";

  return (
    <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex-1 min-w-[150px]">
        <label htmlFor="filter-genre" className="mb-1 block text-xs font-medium text-muted">
          Genre
        </label>
        <select
          id="filter-genre"
          className="field"
          value={filters.genre}
          onChange={(event) => onChange("genre", event.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[130px]">
        <label htmlFor="filter-year" className="mb-1 block text-xs font-medium text-muted">
          Release year
        </label>
        <select
          id="filter-year"
          className="field"
          value={filters.year}
          onChange={(event) => onChange("year", event.target.value)}
        >
          <option value="">Any year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {showSort && (
        <div className="flex-1 min-w-[160px]">
          <label htmlFor="filter-sort" className="mb-1 block text-xs font-medium text-muted">
            Sort by
          </label>
          <select
            id="filter-sort"
            className="field"
            value={filters.sort}
            onChange={(event) => onChange("sort", event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilter}
        className="btn-ghost sm:w-auto"
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
