'use client';
import './mint/index.js';
import { NFTMintCard } from './NFTMintCard.js';
import './view/index.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { NFTCreator } from './mint/NFTCreator.js';
import { NFTMedia } from './view/NFTMedia.js';
import { NFTCollectionTitle } from './mint/NFTCollectionTitle.js';
import { NFTQuantitySelector } from './mint/NFTQuantitySelector.js';
import { NFTAssetCost } from './mint/NFTAssetCost.js';
import { NFTMintButton } from './mint/NFTMintButton.js';
function NFTMintCardDefault({
  contractAddress,
  tokenId,
  useNFTData,
  buildMintTransaction,
  isSponsored,
  onStatus,
  onSuccess,
  onError
}) {
  return /*#__PURE__*/jsxs(NFTMintCard, {
    contractAddress: contractAddress,
    tokenId: tokenId,
    useNFTData: useNFTData,
    buildMintTransaction: buildMintTransaction,
    isSponsored: isSponsored,
    onStatus: onStatus,
    onSuccess: onSuccess,
    onError: onError,
    children: [/*#__PURE__*/jsx(NFTCreator, {}), /*#__PURE__*/jsx(NFTMedia, {}), /*#__PURE__*/jsx(NFTCollectionTitle, {}), /*#__PURE__*/jsx(NFTQuantitySelector, {}), /*#__PURE__*/jsx(NFTAssetCost, {}), /*#__PURE__*/jsx(NFTMintButton, {})]
  });
}
export { NFTMintCardDefault };
//# sourceMappingURL=NFTMintCardDefault.js.map
