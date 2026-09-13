// Numbered pagination with Previous/Next.
// Builds a short window of page numbers around the current page so the
// control stays small even with 500 pages.

const buildPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  for (let page = Math.max(1, end - 4); page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageNumbers(currentPage, totalPages);

  const go = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className="btn-ghost"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pages[0] > 1 && <span className="px-1 text-muted">…</span>}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => go(page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Go to page ${page}`}
          className={
            page === currentPage
              ? "btn bg-gold px-3.5 text-night"
              : "btn-ghost px-3.5"
          }
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && <span className="px-1 text-muted">…</span>}

      <button
        type="button"
        className="btn-ghost"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <p className="w-full text-center text-xs text-muted">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
};

export default Pagination;
