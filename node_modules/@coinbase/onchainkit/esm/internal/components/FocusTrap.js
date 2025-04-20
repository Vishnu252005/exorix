import { useRef, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';
const FOCUSABLE_ELEMENTS_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/**
 * FocusTrap ensures keyboard focus remains within a contained area for accessibility
 */
function FocusTrap({
  active = true,
  children
}) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  useEffect(() => {
    if (!active) {
      return;
    }
    // Store currently focused element to restore later
    previousFocusRef.current = document.activeElement;
    if (containerRef.current) {
      // Query all interactive elements that can receive focus
      const firstFocusable = containerRef.current.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
      firstFocusable?.focus();
    }
    return () => {
      // Restore focus to previous element when trap is destroyed
      previousFocusRef.current?.focus();
    };
  }, [active]);
  const getFocusableElements = () => containerRef.current?.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
  const handleTabNavigation = (event, elements) => {
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const isFirstElement = document.activeElement === firstElement;
    const isLastElement = document.activeElement === lastElement;
    if (event.shiftKey && isFirstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && isLastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };
  const handleKeyDown = event => {
    if (!active || event.key !== 'Tab') {
      return;
    }
    const focusableElements = getFocusableElements();
    if (!focusableElements?.length) {
      return;
    }
    handleTabNavigation(event, focusableElements);
  };
  return /*#__PURE__*/jsx("div", {
    "data-testid": "ockFocusTrap",
    onKeyDown: handleKeyDown,
    ref: containerRef,
    children: children
  });
}
export { FocusTrap };
//# sourceMappingURL=FocusTrap.js.map
