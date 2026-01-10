import { useEffect, useRef, useState } from "react";

/**
 * Throttle a value - returns the value at most once per specified interval
 * @param value - The value to throttle
 * @param limit - The time limit in milliseconds
 * @returns The throttled value
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 * 
 * useEffect(() => {
 *   // This will run at most once every 100ms
 *   updateHeaderPosition(throttledScrollY);
 * }, [throttledScrollY]);
 * ```
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRan.current;

    if (timeSinceLastRun >= limit) {
      // Enough time has passed, update immediately
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      // Schedule update for when enough time will have passed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
        timeoutRef.current = null;
      }, limit - timeSinceLastRun);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, limit]);

  return throttledValue;
}

