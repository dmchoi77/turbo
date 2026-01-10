import { useEffect } from "react";

/**
 * Run cleanup on unmount only
 * @param cleanup - The cleanup function to run on unmount
 * @example
 * ```tsx
 * useUnmount(() => {
 *   console.log('Component unmounting!');
 *   cleanupResources();
 * });
 * ```
 */
export function useUnmount(cleanup: () => void): void {
  useEffect(() => {
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

