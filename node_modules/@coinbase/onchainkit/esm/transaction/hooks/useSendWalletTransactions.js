import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { Capabilities } from '../../core/constants.js';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions.js';
import { sendSingleTransactions } from '../utils/sendSingleTransactions.js';

/**
 * Sends transactions to the wallet using the appropriate hook based on Transaction props and wallet capabilities
 */
const useSendWalletTransactions = ({
  capabilities,
  sendCallAsync,
  sendCallsAsync,
  walletCapabilities
}) => {
  const config = useConfig();
  return useCallback(async transactions => {
    if (!transactions) {
      return;
    }
    const resolvedTransactions = await Promise.resolve(transactions);
    if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
      // Batched transactions
      await sendBatchedTransactions({
        capabilities,
        sendCallsAsync,
        transactions: resolvedTransactions
      });
    } else {
      // Non-batched transactions
      await sendSingleTransactions({
        config,
        sendCallAsync,
        transactions: resolvedTransactions
      });
    }
  }, [sendCallsAsync, sendCallAsync, capabilities, walletCapabilities, config]);
};
export { useSendWalletTransactions };
//# sourceMappingURL=useSendWalletTransactions.js.map
