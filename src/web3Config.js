import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';

// Get API key from environment variable or use a fallback
const onchainKitApiKey = import.meta.env.VITE_ONCHAINKIT_API_KEY || "YOUR_FALLBACK_ONCHAINKIT_KEY";

// Create Wagmi configuration
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({ target: 'metaMask' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: false,
});

// Create query client
export const queryClient = new QueryClient();

// Export the OnchainKit API key
export { onchainKitApiKey };

// Contract addresses (deployed on Base Sepolia)
export const CONTRACT_ADDRESSES = {
  rewardToken: '0xc4FEbC06ff857d8D34E11dF7f6d85B96ee90711A',
  questBadge: '0x8dC90D5aB7B02a1941e6574f7916320EF51ca563',
  distributor: '0xED213E8D66AF8b18f4f19458065e7AaE69AaE3F8'
}; 