'use client';
import { copyToClipboard } from '../utils/copyToClipboard.js';
import { useCallback } from 'react';
import { jsx } from 'react/jsx-runtime';
function CopyButton({
  label,
  copyValue,
  onSuccess,
  onError,
  className,
  'aria-label': ariaLabel
}) {
  const handleCopy = useCallback(() => copyToClipboard({
    copyValue,
    onSuccess,
    onError
  }), [copyValue, onSuccess, onError]);
  return /*#__PURE__*/jsx("button", {
    type: "button",
    "data-testid": "ockCopyButton",
    className: className,
    onClick: handleCopy,
    onKeyDown: handleCopy,
    "aria-label": ariaLabel,
    children: label
  });
}
export { CopyButton };
//# sourceMappingURL=CopyButton.js.map
