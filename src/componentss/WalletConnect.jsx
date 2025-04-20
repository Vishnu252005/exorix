import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { CONTRACT_ADDRESSES } from '../web3Config';

/**
 * WalletConnect component that handles wallet connection and displays user balance
 * 
 * @returns {React.ReactElement} Wallet connection component
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.rewardToken,
  });

  return (
    <div className="flex items-center space-x-4">
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Balance: {isBalanceLoading ? 'Loading...' : 
              balanceData ? `${formatUnits(balanceData.value, balanceData.decimals)} ADR` : '0 ADR'}
          </span>
          <div className="text-xs text-gray-500">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </div>
        </div>
      )}
    </div>
  );
} 