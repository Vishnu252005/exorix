'use client';
import { NFTCard } from './NFTCard.js';
import './view/index.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { NFTMedia } from './view/NFTMedia.js';
import { NFTTitle } from './view/NFTTitle.js';
import { NFTOwner } from './view/NFTOwner.js';
import { NFTLastSoldPrice } from './view/NFTLastSoldPrice.js';
import { NFTNetwork } from './view/NFTNetwork.js';
function NFTCardDefault({
  contractAddress,
  tokenId,
  useNFTData,
  onStatus,
  onSuccess,
  onError
}) {
  return /*#__PURE__*/jsxs(NFTCard, {
    contractAddress: contractAddress,
    tokenId: tokenId,
    useNFTData: useNFTData,
    onStatus: onStatus,
    onSuccess: onSuccess,
    onError: onError,
    children: [/*#__PURE__*/jsx(NFTMedia, {}), /*#__PURE__*/jsx(NFTTitle, {}), /*#__PURE__*/jsx(NFTOwner, {}), /*#__PURE__*/jsx(NFTLastSoldPrice, {}), /*#__PURE__*/jsx(NFTNetwork, {})]
  });
}
export { NFTCardDefault };
//# sourceMappingURL=NFTCardDefault.js.map
