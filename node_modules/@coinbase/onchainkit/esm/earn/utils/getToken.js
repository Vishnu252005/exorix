import { baseTokens } from '../../token/constants.js';
import { base } from 'viem/chains';
function getToken({
  address,
  symbol,
  name,
  decimals
}) {
  const token = baseTokens.find(token => token.address === address);
  if (token) {
    return token;
  }
  if (symbol && name && decimals) {
    return {
      address,
      name,
      symbol,
      decimals,
      image: null,
      chainId: base.id
    };
  }
  return undefined;
}
export { getToken };
//# sourceMappingURL=getToken.js.map
