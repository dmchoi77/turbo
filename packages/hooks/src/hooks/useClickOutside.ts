import { useEffect, RefObject } from "react";

/**
 * Detect clicks outside an element
 * @param ref - A ref to the element to detect clicks outside of
 * @param handler - The callback function to call when a click outside occurs
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * 
 * useClickOutside(ref, () => {
 *   console.log('Clicked outside!');
 *   setIsOpen(false);
 * });
 * 
 * return <div ref={ref}>Content</div>;
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

