import { useState, useEffect, useCallback } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type AsyncFunction<T> = () => Promise<T>;

/**
 * Handle async operations
 * @param asyncFunction - The async function to execute
 * @param immediate - Whether to execute immediately on mount (default: true)
 * @returns A tuple of [state, execute, reset]
 * @example
 * ```tsx
 * const fetchUser = async () => {
 *   const response = await fetch('/api/user');
 *   return response.json();
 * };
 * 
 * const [{ data, loading, error }, execute, reset] = useAsync(fetchUser);
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <UserProfile user={data} />;
 * ```
 */
export function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  immediate: boolean = true
): [
  AsyncState<T>,
  () => Promise<void>,
  () => void
] {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return [state, execute, reset];
}

