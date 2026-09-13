// Shown whenever a request fails. Always offers a way forward (Retry).

const ErrorMessage = ({ message, onRetry }) => (
  <div
    role="alert"
    className="card-surface mx-auto max-w-md p-6 text-center"
  >
    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-xl">
      !
    </div>
    <h3 className="text-base font-semibold">Something went wrong</h3>
    <p className="mt-1 text-sm text-muted">{message || "Please try again."}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary mt-4">
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
