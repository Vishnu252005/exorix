import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Gift, Trophy } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../web3Config';

// Contract ABIs
const questBadgeABI = [
  "function safeMint(address to, string memory uri) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)"
] as const;

const rewardTokenABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
] as const;

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

const BaseTrack: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentTxHash, setCurrentTxHash] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<string>('');
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [lastClaim, setLastClaim] = useState<string>('Never');
  const [totalClaims, setTotalClaims] = useState<number>(0);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Read contract hooks with refetch
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardToken,
    abi: rewardTokenABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  const { data: badgeData, refetch: refetchBadges } = useReadContract({
    address: CONTRACT_ADDRESSES.questBadge,
    abi: questBadgeABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  const { data: lastClaimData, refetch: refetchLastClaim } = useReadContract({
    address: CONTRACT_ADDRESSES.distributor,
    abi: distributorABI,
    functionName: 'lastClaimTime',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  const { data: claimCountData, refetch: refetchClaimCount } = useReadContract({
    address: CONTRACT_ADDRESSES.distributor,
    abi: distributorABI,
    functionName: 'claimCount',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address),
      refetchInterval: 5000,
    },
  });

  // Contract write functions with error handling
  const { writeContract: mintBadge, data: mintTxHash, error: mintError } = useWriteContract();
  const { writeContract: distributeReward, data: claimTxHash, error: claimError } = useWriteContract();

  // Transaction receipt hooks
  const { isLoading: isMintLoading, isSuccess: isMintSuccess, data: mintReceipt } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess, data: claimReceipt } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  // Refresh all data after successful transactions
  const refreshAllData = async () => {
    console.log('Refreshing all data...');
    await Promise.all([
      refetchBalance(),
      refetchBadges(),
      refetchLastClaim(),
      refetchClaimCount(),
    ]);
  };

  // Handle successful transactions
  useEffect(() => {
    if (isMintSuccess || isClaimSuccess) {
      console.log('Transaction successful, refreshing data...');
      refreshAllData();
    }
  }, [isMintSuccess, isClaimSuccess]);

  // Update UI with transaction status
  useEffect(() => {
    if (claimTxHash) {
      console.log('Claim transaction submitted:', claimTxHash);
      setCurrentTxHash(claimTxHash);
      setStatus('Transaction submitted to blockchain');
      setTransactionDetails(`Transaction hash: ${claimTxHash}`);
    }

    if (isClaimLoading) {
      console.log('Waiting for claim confirmation...');
      setStatus('Waiting for blockchain confirmation...');
    }

    if (claimReceipt) {
      console.log('Claim receipt received:', claimReceipt);
      const success = claimReceipt.status === 'success';
      setStatus(success ? 'Transaction confirmed! Rewards claimed successfully!' : 'Transaction failed');
      setTransactionDetails(
        `Block number: ${claimReceipt.blockNumber}\n` +
        `Gas used: ${claimReceipt.gasUsed.toString()}\n` +
        `Status: ${claimReceipt.status}`
      );
    }

    if (claimError) {
      console.error('Claim error:', claimError);
      setError(`Transaction failed: ${claimError.message}`);
    }
  }, [claimTxHash, isClaimLoading, claimReceipt, claimError]);

  // Update UI data when contract reads change
  useEffect(() => {
    if (badgeData) {
      setBadgeCount(Number(badgeData));
    }
    if (lastClaimData) {
      const timestamp = Number(lastClaimData) * 1000;
      setLastClaim(timestamp > 0 ? new Date(timestamp).toLocaleString() : 'Never');
    }
    if (claimCountData) {
      setTotalClaims(Number(claimCountData));
    }
  }, [badgeData, lastClaimData, claimCountData]);

  const handleMintBadge = async () => {
    try {
      setError('');
      setStatus('Minting badge...');
      
      const tokenURI = "ipfs://your-metadata-uri";
      await mintBadge({
        address: CONTRACT_ADDRESSES.questBadge,
        abi: questBadgeABI,
        functionName: 'safeMint',
        args: [address as `0x${string}`, tokenURI],
      });
    } catch (err) {
      setError(`Failed to mint badge: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('');
    }
  };

  const handleClaimRewards = async () => {
    try {
      setError('');
      setStatus('Initiating transaction...');
      setIsProcessing(true);
      setTransactionDetails('');
      console.log('Starting reward claim...');
      
      const amount = BigInt(100) * BigInt(10 ** 18); // 100 tokens with 18 decimals
      console.log('Claiming rewards with params:', {
        address: address,
        amount: amount.toString()
      });

      await distributeReward({
        address: CONTRACT_ADDRESSES.distributor as `0x${string}`,
        abi: distributorABI,
        functionName: 'distributeRewards',
        args: [address as `0x${string}`, amount]
      });
    } catch (err) {
      console.error('Error in handleClaimRewards:', err);
      setError(`Failed to claim rewards: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const getExplorerLink = (hash: string) => {
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
            Base Quest Platform
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Complete quests, earn badges, and claim rewards
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
                {isConnected ? 'Connected to Base Sepolia' : 'Not Connected'}
              </span>
            </div>
            {isConnected && address && (
              <div className="text-gray-400 flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>{truncateAddress(address)}</span>
              </div>
            )}
          </div>

          {/* Stats Section */}
          {isConnected && (
            <div className="space-y-4 mb-6">
              {/* Reward Balance */}
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Your Rewards:</span>
                  <span className="text-green-400 font-semibold">
                    {balanceData ? (Number(balanceData) / 10 ** 18).toFixed(2) : '0'} ADR
                  </span>
                </div>
              </div>

              {/* Badge Count */}
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Badges Owned:</span>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-400 font-semibold">{badgeCount}</span>
                  </div>
                </div>
              </div>

              {/* Claim History */}
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Claims:</span>
                    <span className="text-blue-400 font-semibold">{totalClaims}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Claim:</span>
                    <span className="text-blue-400 font-semibold">{lastClaim}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="space-y-6">
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </motion.button>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMintBadge}
                    className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Mint Badge</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClaimRewards}
                    disabled={isProcessing || isClaimLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {(isProcessing || isClaimLoading) ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Gift className="w-5 h-5" />
                    )}
                    <span>
                      {isProcessing ? 'Preparing Transaction...' : 
                       isClaimLoading ? 'Confirming on Blockchain...' : 
                       'Claim Rewards'}
                    </span>
                  </motion.button>
                </div>

                {/* Transaction Status with Details */}
                {(status || transactionDetails) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gray-900/50 space-y-3"
                  >
                    {/* Status */}
                    {status && (
                      <div className="flex items-center space-x-2">
                        {isClaimLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        ) : isClaimSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                        <p className="text-gray-300">{status}</p>
                      </div>
                    )}

                    {/* Transaction Details */}
                    {transactionDetails && (
                      <div className="text-sm text-gray-400 font-mono bg-gray-900/50 p-3 rounded-lg">
                        {transactionDetails.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}

                    {/* Explorer Link */}
                    {currentTxHash && (
                      <a
                        href={`https://sepolia.basescan.org/tx/${currentTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on Base Sepolia Explorer</span>
                      </a>
                    )}
                  </motion.div>
                )}
              </>
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
      </div>
    </motion.div>
  );
};

export default BaseTrack; 