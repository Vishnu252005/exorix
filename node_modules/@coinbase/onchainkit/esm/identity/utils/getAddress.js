import { getChainPublicClient } from '../../core/network/getChainPublicClient.js';
import { isBase } from '../../core/utils/isBase.js';
import { isEthereum } from '../../core/utils/isEthereum.js';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants.js';
import { isBasename } from './isBasename.js';
import { mainnet } from 'viem/chains';

/**
 * Get address from ENS name or Basename.
 */
const getAddress = async ({
  name,
  chain = mainnet
}) => {
  const chainIsBase = isBase({
    chainId: chain.id
  });
  const chainIsEthereum = isEthereum({
    chainId: chain.id
  });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  if (!chainSupportsUniversalResolver) {
    return Promise.reject('ChainId not supported, name resolution is only supported on Ethereum and Base.');
  }
  const client = getChainPublicClient(chain);
  // Gets address for ENS name.
  const address = await client.getEnsAddress({
    name,
    universalResolverAddress: isBasename(name) ? RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id] : undefined
  });
  return address ?? null;
};
export { getAddress };
//# sourceMappingURL=getAddress.js.map
