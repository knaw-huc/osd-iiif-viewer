import {useState} from 'react';

/**
 * Keep object reference intact when stringified content remains equal
 */
export function useStableState<T>(
  options: T
): T {
  const [stable, setStable] = useState(options);
  const [key, setKey] = useState(() => JSON.stringify(options));

  const json = JSON.stringify(options);
  if (json !== key) {
    setKey(json);
    setStable(options);
  }

  return stable;
}
