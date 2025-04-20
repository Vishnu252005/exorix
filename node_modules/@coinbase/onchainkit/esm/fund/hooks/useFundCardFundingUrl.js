import { useOnchainKit } from '../../useOnchainKit.js';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useFundContext } from '../components/FundCardProvider.js';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl.js';
const useFundCardFundingUrl = () => {
  const _useOnchainKit = useOnchainKit(),
    projectId = _useOnchainKit.projectId,
    defaultChain = _useOnchainKit.chain;
  const _useAccount = useAccount(),
    address = _useAccount.address,
    accountChain = _useAccount.chain;
  const _useFundContext = useFundContext(),
    selectedPaymentMethod = _useFundContext.selectedPaymentMethod,
    selectedInputType = _useFundContext.selectedInputType,
    fundAmountFiat = _useFundContext.fundAmountFiat,
    fundAmountCrypto = _useFundContext.fundAmountCrypto,
    asset = _useFundContext.asset,
    currency = _useFundContext.currency;
  const chain = accountChain || defaultChain;
  return useMemo(() => {
    if (projectId === null || address === undefined) {
      return undefined;
    }
    const fundAmount = selectedInputType === 'fiat' ? fundAmountFiat : fundAmountCrypto;
    return getOnrampBuyUrl({
      projectId,
      assets: [asset],
      presetFiatAmount: selectedInputType === 'fiat' ? Number(fundAmount) : undefined,
      presetCryptoAmount: selectedInputType === 'crypto' ? Number(fundAmount) : undefined,
      defaultPaymentMethod: selectedPaymentMethod?.id,
      addresses: {
        [address]: [chain.name.toLowerCase()]
      },
      fiatCurrency: currency,
      originComponentName: 'FundCard'
    });
  }, [asset, fundAmountFiat, fundAmountCrypto, selectedPaymentMethod, selectedInputType, projectId, address, chain, currency]);
};
export { useFundCardFundingUrl };
//# sourceMappingURL=useFundCardFundingUrl.js.map
