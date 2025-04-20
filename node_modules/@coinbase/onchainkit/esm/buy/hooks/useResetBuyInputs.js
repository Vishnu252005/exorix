import { useCallback } from 'react';

/**
 * Refreshes balances and inputs post-swap
 */
const useResetBuyInputs = ({
  fromETH,
  fromUSDC,
  from,
  to
}) => {
  return useCallback(async () => {
    await Promise.all([from?.balanceResponse?.refetch(), from?.setAmount(''), from?.setAmountUSD(''), fromETH.balanceResponse?.refetch(), fromETH.setAmount(''), fromETH.setAmountUSD(''), fromUSDC.balanceResponse?.refetch(), fromUSDC.setAmount(''), fromUSDC.setAmountUSD(''), to.balanceResponse?.refetch(), to.setAmount(''), to.setAmountUSD('')]);
  }, [from, fromETH, fromUSDC, to]);
};
export { useResetBuyInputs };
//# sourceMappingURL=useResetBuyInputs.js.map
