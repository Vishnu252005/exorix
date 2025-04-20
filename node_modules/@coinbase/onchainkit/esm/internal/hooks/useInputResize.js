function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { useCallback, useEffect } from 'react';
const defaultConfig = {
  baseFontSize: 3.75,
  // 60px = 3.75rem at default browser font size
  minScale: 0.01
};
function useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef, config = {}) {
  const _defaultConfig$config = _objectSpread(_objectSpread({}, defaultConfig), config),
    baseFontSize = _defaultConfig$config.baseFontSize,
    minScale = _defaultConfig$config.minScale;
  const updateScale = useCallback(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const input = inputRef.current;
    const measure = measureRef.current;
    const label = labelRef.current;
    if (!container || !wrapper || !input || !measure || !label) {
      return;
    }

    // Set base font size in rem units
    measure.style.fontSize = `${baseFontSize}rem`;
    input.style.fontSize = `${baseFontSize}rem`;

    // Get natural content width
    const contentWidth = measure.clientWidth;
    const availableWidth = container.clientWidth - label.clientWidth;

    // Set input width to match content
    input.style.width = `${contentWidth}px`;
    if (contentWidth > availableWidth) {
      const scale = availableWidth / contentWidth;
      const finalScale = Math.max(scale, minScale);

      // Apply scale to wrapper instead of input
      wrapper.style.transform = `scale(${finalScale})`;
      wrapper.style.transformOrigin = 'left center';
    } else {
      wrapper.style.transform = 'scale(1)';
    }
  }, [baseFontSize, minScale, containerRef, wrapperRef, inputRef, measureRef, labelRef]);

  // Update on resize and font size change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, updateScale]);
  return updateScale;
}
export { useInputResize };
//# sourceMappingURL=useInputResize.js.map
