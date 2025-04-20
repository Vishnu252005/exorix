import { useNFTContext } from '../NFTProvider.js';
import { cn, color, text } from '../../../styles/theme.js';
import { formatAmount } from '../../../swap/utils/formatAmount.js';
import { formatAmount as formatAmount$1 } from '../../../token/utils/formatAmount.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTLastSoldPrice({
  className,
  label = 'Last sale price'
}) {
  const _useNFTContext = useNFTContext(),
    lastSoldPrice = _useNFTContext.lastSoldPrice;
  if (!lastSoldPrice?.amount || !lastSoldPrice?.currency || !lastSoldPrice?.amountUSD) {
    return null;
  }
  const amount = lastSoldPrice.amount,
    currency = lastSoldPrice.currency,
    amountUSD = lastSoldPrice.amountUSD;
  return /*#__PURE__*/jsxs("div", {
    className: cn(text.label2, 'flex justify-between', className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsxs("div", {
      className: "flex",
      children: [/*#__PURE__*/jsxs("div", {
        className: text.label1,
        children: [formatAmount(amount), " ", currency]
      }), /*#__PURE__*/jsx("div", {
        className: "px-2",
        children: "~"
      }), /*#__PURE__*/jsxs("div", {
        children: ["$", formatAmount$1(`${amountUSD}`, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })]
      })]
    })]
  });
}
export { NFTLastSoldPrice };
//# sourceMappingURL=NFTLastSoldPrice.js.map
