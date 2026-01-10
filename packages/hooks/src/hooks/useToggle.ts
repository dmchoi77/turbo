import { useState, useCallback } from "react";

/**
 * Boolean state toggle hook
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple of [value, toggle, setValue]
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     {isOpen && <Modal />}
 *   </div>
 * );
 * ```
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}

