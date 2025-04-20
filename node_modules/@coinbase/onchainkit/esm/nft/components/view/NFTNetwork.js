import { base } from 'viem/chains';
import { useChainId } from 'wagmi';
import { baseSvg } from '../../../internal/svg/baseSvg.js';
import { cn, color, text } from '../../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const networkMap = {
  8453: {
    chain: base,
    icon: baseSvg
  }
};
function NFTNetwork({
  className,
  label = 'Network'
}) {
  const chainId = useChainId();
  if (!chainId || !networkMap[chainId]) {
    return null;
  }
  const _networkMap$chainId = networkMap[chainId],
    chain = _networkMap$chainId.chain,
    icon = _networkMap$chainId.icon;
  return /*#__PURE__*/jsxs("div", {
    className: cn(text.label2, 'flex items-center justify-between', className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsxs("div", {
      className: "flex items-center gap-1",
      children: [/*#__PURE__*/jsx("div", {
        className: "h-4 w-4 object-cover",
        children: icon
      }), /*#__PURE__*/jsx("div", {
        children: chain.name
      })]
    })]
  });
}
export { NFTNetwork };
//# sourceMappingURL=NFTNetwork.js.map
