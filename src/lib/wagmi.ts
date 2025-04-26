import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Smart Wallet Configuration
export const cbWalletConnector = coinbaseWallet({
  appName: "Stellar",
  preference: "smartWalletOnly",  // Forces the use of smart wallet
});

// Main Configuration
export const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [cbWalletConnector],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
}); 