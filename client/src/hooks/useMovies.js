// Fetches a movie list and manages loading / error / data state.
//
// `fetcher` is a function that receives an AbortSignal and returns a promise.
// `deps` is the dependency array that decides when to re-fetch.
//
// Two details worth explaining in an interview:
// 1. We keep the previous results on screen while a new page loads, so the
//    grid does not flash empty. `isRefreshing` drives a subtle overlay.
// 2. Every request gets an AbortController. When the deps change we abort the
//    old request, so a slow earlier response can never overwrite a newer one.

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/api";

export const useMovies = (fetcher, deps = [], options = {}) => {
  const { enabled = true } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;

    const run = async () => {
      setError(null);
      // First load shows a skeleton, later loads show a light overlay.
      if (data === null) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const result = await fetcher(controller.signal);
        if (!ignore) setData(result);
      } catch (err) {
        const message = getErrorMessage(err);
        // message === null means the request was cancelled on purpose.
        if (!ignore && message) setError(message);
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    run();

    return () => {
      ignore = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, reloadCount]);

  return { data, isLoading, isRefreshing, error, reload };
};
