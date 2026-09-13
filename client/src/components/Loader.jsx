// Two loading indicators: a spinner and grid skeletons.

export const Spinner = ({ label = "Loading" }) => (
  <span
    role="status"
    aria-label={label}
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
  />
);

export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[2/3] w-full rounded-xl bg-surface" />
    <div className="mt-3 h-3 w-4/5 rounded bg-surface" />
    <div className="mt-2 h-3 w-2/5 rounded bg-surface" />
  </div>
);

export const GridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);
