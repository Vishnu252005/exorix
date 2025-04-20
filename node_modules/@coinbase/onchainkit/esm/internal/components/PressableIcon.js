import { cn, pressable, border } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function PressableIcon({
  children,
  className,
  onClick,
  ariaLabel
}) {
  return /*#__PURE__*/jsx("button", {
    type: "button",
    onClick: onClick,
    "data-testid": "ockPressableIconButton",
    "aria-label": ariaLabel,
    className: cn(pressable.default, border.radiusInner, border.default, 'flex items-center justify-center', className),
    children: children
  });
}
export { PressableIcon };
//# sourceMappingURL=PressableIcon.js.map
