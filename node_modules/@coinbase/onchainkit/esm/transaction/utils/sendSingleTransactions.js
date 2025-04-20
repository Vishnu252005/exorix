import { encodeFunctionData } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { isContract } from './isContract.js';
const sendSingleTransactions = async ({
  config,
  sendCallAsync,
  transactions
}) => {
  const calls = transactions?.map(transaction => {
    if (isContract(transaction)) {
      return {
        data: encodeFunctionData({
          abi: transaction?.abi,
          functionName: transaction?.functionName,
          args: transaction?.args
        }),
        to: transaction?.address
      };
    }
    return transaction;
  });
  for (const call of calls) {
    const txHash = await sendCallAsync(call);
    if (txHash) {
      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1
      });
    }
  }
};
export { sendSingleTransactions };
//# sourceMappingURL=sendSingleTransactions.js.map
