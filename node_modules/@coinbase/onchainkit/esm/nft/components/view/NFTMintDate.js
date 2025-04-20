import { useNFTContext } from '../NFTProvider.js';
import { useMemo } from 'react';
import { cn, color, text } from '../../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};
function NFTMintDate({
  className,
  label = 'Mint date'
}) {
  const _useNFTContext = useNFTContext(),
    mintDate = _useNFTContext.mintDate;
  const formattedDate = useMemo(() => {
    if (!mintDate) {
      return null;
    }
    const formatter = new Intl.DateTimeFormat(undefined, DATE_OPTIONS);
    return formatter.format(mintDate);
  }, [mintDate]);
  if (!formattedDate) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn(text.label2, 'flex items-center justify-between', className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsx("div", {
      children: formattedDate
    })]
  });
}
export { NFTMintDate };
//# sourceMappingURL=NFTMintDate.js.map
