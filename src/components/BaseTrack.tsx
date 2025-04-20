import React, { useState } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Gift } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { CONTRACT_ADDRESSES } from '../web3Config';

const BaseTrack: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [claimStatus, setClaimStatus] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentChainId, setCurrentChainId] = useState<string>('');

  const { address, isConnected: wagmiConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

  // Monad testnet configuration
  const MONAD_CONFIG = {
    chainId: '0x279f', // 10143 in decimal
    chainName: 'Monad Testnet',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com']
  };

  // Contract ABI
  const distributorABI = [
    {
      name: "distributeRewards",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" }
      ],
      outputs: []
    }
  ] as const;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Connect to MetaMask
  const connectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      
      const metaMaskConnector = connectors.find(c => c.id === 'metaMask');
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector });
        setWalletAddress(address || '');
        setIsConnected(true);
      }
    } catch (err) {
      setError(`Failed to connect wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Claim Rewards
  const claimRewards = async (): Promise<void> => {
    try {
      if (!isConnected || !address) {
        setError('Please connect your wallet first');
        return;
      }

      setIsLoading(true);
      setClaimStatus('Claiming rewards...');
      setError('');

      // Use OnchainKit for transaction
      const amount = BigInt(100) * BigInt(10 ** 18); // 100 tokens with 18 decimals
      
      const tx = await writeContract({
        address: CONTRACT_ADDRESSES.distributor as `0x${string}`,
        abi: distributorABI,
        functionName: 'distributeRewards',
        args: [address, amount]
      });

      if (tx) {
        setTransactionHash(tx);
        setClaimStatus('Rewards claimed successfully!');
      }
    } catch (err) {
      setError(`Failed to claim rewards: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setClaimStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0B]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Claim Your Rewards
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Connect your wallet and claim your rewards
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          variants={cardVariants}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50"
        >
          {/* Connection Status */}
          <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className="text-gray-300">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {isConnected && (
              <div className="text-gray-400 flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>{truncateAddress(walletAddress)}</span>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="space-y-6">
            {!isConnected ? (
              <ConnectWallet />
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={claimRewards}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Claim Rewards</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Status Messages */}
            {claimStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-gray-900/50 text-gray-300"
              >
                <p className="font-semibold mb-1">Status:</p>
                <p className="text-gray-400">{claimStatus}</p>
              </motion.div>
            )}

            {transactionHash && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-gray-900/50"
              >
                <p className="font-semibold text-gray-300 mb-1">Transaction Hash:</p>
                <a
                  href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-2"
                >
                  <span className="truncate">{transactionHash}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}

            {/* Error Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <span className="text-red-400">{error}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-400"
        >
          <p className="flex items-center justify-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${currentChainId === MONAD_CONFIG.chainId ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>
              {currentChainId === MONAD_CONFIG.chainId 
                ? 'Connected to Monad Testnet' 
                : 'Please connect to Monad Testnet'}
            </span>
          </p>
          <p className="mt-2">
            <a
              href="https://docs.monad.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors inline-f