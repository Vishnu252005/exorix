import { useRef, useCallback, useEffect } from 'react';
const usePopupMonitor = onClose => {
  const intervalRef = useRef(null);

  // Start monitoring the popup
  const startPopupMonitor = useCallback(popupWindow => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      if (popupWindow.closed) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onClose?.();
      }
    }, 500);
  }, [onClose]);

  // Stop monitoring the popup
  const stopPopupMonitor = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => stopPopupMonitor();
  }, [stopPopupMonitor]);
  return {
    startPopupMonitor,
    stopPopupMonitor
  };
};
export { usePopupMonitor };
//# sourceMappingURL=usePopupMonitor.js.map
