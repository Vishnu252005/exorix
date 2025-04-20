'use client';
import { useOutsideClick } from '../../internal/hooks/useOutsideClick.js';
import { useTheme } from '../../internal/hooks/useTheme.js';
import { cn } from '../../styles/theme.js';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../../swap/constants.js';
import { useRef } from 'react';
import { BuyAmountInput } from './BuyAmountInput.js';
import { BuyButton } from './BuyButton.js';
import { BuyDropdown } from './BuyDropdown.js';
import { BuyMessage } from './BuyMessage.js';
import { useBuyContext, BuyProvider } from './BuyProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function BuyContent({
  className
}) {
  const componentTheme = useTheme();
  const _useBuyContext = useBuyContext(),
    isDropdownOpen = _useBuyContext.isDropdownOpen,
    setIsDropdownOpen = _useBuyContext.setIsDropdownOpen;
  const buyContainerRef = useRef(null);
  useOutsideClick(buyContainerRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });
  return /*#__PURE__*/jsxs("div", {
    ref: buyContainerRef,
    className: cn('relative flex flex-col gap-2', componentTheme, className),
    children: [/*#__PURE__*/jsxs("div", {
      className: cn('flex items-center gap-4'),
      children: [/*#__PURE__*/jsx(BuyAmountInput, {}), /*#__PURE__*/jsx(BuyButton, {}), isDropdownOpen && /*#__PURE__*/jsx(BuyDropdown, {})]
    }), /*#__PURE__*/jsx(BuyMessage, {})]
  });
}
function Buy({
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE
  },
  className,
  disabled = false,
  experimental = {
    useAggregator: false
  },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  toToken,
  fromToken
}) {
  return /*#__PURE__*/jsx(BuyProvider, {
    config: config,
    disabled: disabled,
    experimental: experimental,
    isSponsored: isSponsored,
    onError: onError,
    onStatus: onStatus,
    onSuccess: onSuccess,
    toToken: toToken,
    fromToken: fromToken,
    children: /*#__PURE__*/jsx(BuyContent, {
      className: className
    })
  });
}
export { Buy };
//# sourceMappingURL=Buy.js.map
