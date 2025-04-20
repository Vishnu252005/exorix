import { useNFTContext } from '../NFTProvider.js';
import { cn, text } from '../../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function NFTTitle({
  className
}) {
  const _useNFTContext = useNFTContext(),
    name = _useNFTContext.name;
  if (!name) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(text.title3, 'overflow-hidden text-ellipsis', className),
    children: name
  });
}
export { NFTTitle };
//# sourceMappingURL=NFTTitle.js.map
