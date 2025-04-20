import { cn, background, border } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';

/**
 * A skeleton component is a visual placeholder that mimics the content of an element while it's loading
 */
function Skeleton({
  className
}) {
  return /*#__PURE__*/jsx("div", {
    className: cn('animate-pulse bg-opacity-50', background.alternate, border.radius, className),
    "data-testid": "ockSkeleton"
  });
}
export { Skeleton };
//# sourceMappingURL=Skeleton.js.map
