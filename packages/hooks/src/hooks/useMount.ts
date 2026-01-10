import { useEffect } from "react";

/**
 * Run effect on mount only
 * @param effect - The effect function to run
 * @example
 * ```tsx
 * useMount(() => {
 *   console.log('Component mounted!');
 *   initializeAnalytics();
 * });
 * ```
 */
export function useMount(effect: () => void | (() => void)): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

