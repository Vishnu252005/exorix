import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Configure chains
const chains = [mainnet, sepolia];

// Create wagmi config
export const config = createConfig({
  chains: chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
  ],
}); 