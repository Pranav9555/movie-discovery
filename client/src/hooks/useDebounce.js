// Returns a value that only updates after the user has stopped changing
// it for `delay` milliseconds. Used so typing in the search box does not
// fire one request per keystroke.

import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // If `value` changes before the timer fires, cancel it and start over.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
