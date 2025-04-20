import { cn, text } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTCollectionTitle({
  className
}) {
  const _useNFTContext = useNFTContext(),
    name = _useNFTContext.name;
  if (!name) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(text.title1, 'overflow-hidden text-ellipsis', className),
    children: name
  });
}
export { NFTCollectionTitle };
//# sourceMappingURL=NFTCollectionTitle.js.map
