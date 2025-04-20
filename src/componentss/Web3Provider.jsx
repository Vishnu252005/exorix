import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { config, queryClient, onchainKitApiKey } from '../web3Config';

/**
 * Web3Provider component that wraps your application with all necessary Web3 providers
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {React.ReactElement} Wrapped components with Web3 providers
 */
export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={onchainKitApiKey}
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 