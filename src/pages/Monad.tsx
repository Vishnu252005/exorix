import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ExternalLink, Trophy, Sparkles, Medal, Star, Lock, Unlock, Gift } from "lucide-react";
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface NFTReward {
    id: string;
    name: string;
    contractAddress: string;
    tokenURI: string;
    description: string;
    status: 'active' | 'claimed' | 'expired';
    couponCode: string;
    claimedBy: string | null;
    mintDate: string | null;
}

const Monad: React.FC = () => {
    const { user } = useAuth();
    const [minting, setMinting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [txHash, setTxHash] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [couponCode, setCouponCode] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [verifying, setVerifying] = useState<boolean>(false);
    const [currentReward, setCurrentReward] = useState<NFTReward | null>(null);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

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

    const switchToMonad = async (): Promise<boolean> => {
        if (!window.ethereum) return false;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: MONAD_CONFIG.chainId }],
            });
            return true;
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [MONAD_CONFIG],
                    });
                    return true;
                } catch (addError) {
                    setError('Failed to add Monad network to MetaMask');
                    return false;
                }
            }
            setError('Failed to switch to Monad network');
            return false;
        }
    };

    // Function to convert IPFS URL to HTTP gateway URL
    const convertToGatewayUrl = (url: string): string => {
        if (url.startsWith('ipfs://')) {
            // Remove 'ipfs://' and add gateway URL
            return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
        }
        return url;
    };

    // Verify winner coupon
    const verifyCoupon = async () => {
        setVerifying(true);
        setError("");
        
        try {
            if (couponCode.trim() === "") {
                throw new Error("Please enter your winner's coupon code");
            }

            // Query Firestore for the NFT reward with this coupon code
            const nftQuery = query(
                collection(db, 'nft'),
                where('couponCode', '==', couponCode.toUpperCase()),
                where('status', '==', 'active')
            );

            const querySnapshot = await getDocs(nftQuery);
            
            if (querySnapshot.empty) {
                throw new Error("Invalid or expired coupon code. Please check and try again.");
            }

            const reward = querySnapshot.docs[0].data() as NFTReward;
            reward.id = querySnapshot.docs[0].id;

            // Check if already claimed
            if (reward.claimedBy) {
                throw new Error("This NFT has already been claimed.");
            }

            setCurrentReward(reward);
            setIsVerified(true);
            setSuccess("Winner Verified! You can now mint your exclusive NFT! 🏆");
            
            // Convert IPFS URL to gateway URL if needed
            const gatewayUrl = convertToGatewayUrl(reward.tokenURI);
            setImageUrl(gatewayUrl);

        } catch (error: any) {
            setError(error.message || "Verification failed");
            setIsVerified(false);
            setCurrentReward(null);
        } finally {
            setVerifying(false);
        }
    };

    const mintNFT = async () => {
        if (!isVerified || !currentReward || !user) {
            setError("Please verify your winner's coupon first!");
            return;
        }

        setMinting(true);
        setError("");
        setSuccess("");
        setTxHash("");

        if (!window.ethereum) {
            setError("Please install MetaMask!");
            setMinting(false);
            return;
        }

        try {
            const switched = await switchToMonad();
            if (!switched) {
                setMinting(false);
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const contract = new Contract(
                currentReward.contractAddress,
                ["function mint() public"],
                signer
            );

            const tx = await contract.mint();
            setTxHash(tx.hash);
            setSuccess("Congratulations Champion! Your victory NFT is being minted! 🎉");

            await tx.wait();
            setSuccess("Victory Achievement Unlocked: Champion's NFT Minted! 🏆");

            // Update the NFT reward in Firestore
            await updateDoc(doc(db, 'nft', currentReward.id), {
                claimedBy: user.uid,
                mintDate: Timestamp.now(),
                status: 'claimed'
            });

        } catch (error: any) {
            console.error("Minting error:", error);
            setError(error.message || "Minting failed!");
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#1F1F23] to-[#0A0A0B] pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center mb-6">
                        <Trophy className="w-16 h-16 text-yellow-500 mr-4" />
                        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
                            Champion's NFT Vault
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        Welcome to the exclusive realm of champions! As a tournament victor or event winner, 
                        you've earned the right to claim your unique commemorative NFT on the Monad Network.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30">
                            <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Exclusive NFTs</h3>
                            <p className="text-gray-400 text-sm">Unique digital collectibles that commemorate your victory</p>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30">
                            <Star className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Monad Network</h3>
                            <p className="text-gray-400 text-sm">Powered by the fast and efficient Monad blockchain</p>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30">
                            <Medal className="w-10 h-10 text-pink-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Champion Status</h3>
                            <p className="text-gray-400 text-sm">Verifiable proof of your tournament victories</p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                >
                    {/* Left Column - Claim Form */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Gift className="w-6 h-6 text-purple-500 mr-3" />
                            Claim Your Champion NFT
                        </h2>

                        {!isVerified ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20">
                                        <h3 className="text-lg font-semibold text-white mb-4">How to Claim:</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start space-x-3 text-gray-300">
                                                <span className="bg-purple-500/20 rounded-full p-1 mt-1">
                                                    <Trophy className="w-4 h-4 text-purple-400" />
                                                </span>
                                                <span>Enter your winner's coupon code below</span>
                                            </li>
                                            <li className="flex items-start space-x-3 text-gray-300">
                                                <span className="bg-purple-500/20 rounded-full p-1 mt-1">
                                                    <Medal className="w-4 h-4 text-purple-400" />
                                                </span>
                                                <span>Verify your champion status</span>
                                            </li>
                                            <li className="flex items-start space-x-3 text-gray-300">
                                                <span className="bg-purple-500/20 rounded-full p-1 mt-1">
                                                    <Gift className="w-4 h-4 text-purple-400" />
                                                </span>
                                                <span>Mint your exclusive NFT reward</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Enter Winner's Coupon Code
                                        </label>
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter your coupon code"
                                            className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={verifyCoupon}
                                            disabled={verifying}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {verifying ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Verifying...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5" />
                                                    <span>Verify Winner Status</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-center space-x-3 text-green-400 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                                    <Unlock className="w-6 h-6" />
                                    <span className="text-lg font-semibold">Winner Verified!</span>
                                </div>
                                
                                <button
                                    onClick={mintNFT}
                                    disabled={minting}
                                    className="w-full py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden group"
                                >
                                    {minting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Minting Champion's NFT...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trophy className="w-6 h-6" />
                                            <span>Claim Champion's NFT</span>
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Info & Network Details */}
                    <div className="space-y-8">
                        {/* Network Info */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <Star className="w-6 h-6 text-yellow-500 mr-3" />
                                Monad Network Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700/30">
                                    <span className="text-gray-400">Chain ID</span>
                                    <code className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded">0x279f (10143)</code>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700/30">
                                    <span className="text-gray-400">Network Name</span>
                                    <span className="text-white">Monad Testnet</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700/30">
                                    <span className="text-gray-400">Currency Symbol</span>
                                    <span className="text-white">MON</span>
                                </div>
                                <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-400">RPC URL</span>
                                        <a href="https://testnet-rpc.monad.xyz" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center">
                                            View <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                    <code className="text-sm text-gray-500 break-all">https://testnet-rpc.monad.xyz</code>
                                </div>
                                <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-400">Block Explorer</span>
                                        <a href="https://testnet.monadexplorer.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center">
                                            View <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                    <code className="text-sm text-gray-500 break-all">https://testnet.monadexplorer.com</code>
                                </div>
                            </div>
                        </div>

                        {/* Success Message & NFT Display */}
                        {success && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20"
                            >
                                <motion.div variants={itemVariants} className="flex items-center space-x-3 mb-6">
                                    <Trophy className="w-8 h-8 text-yellow-500" />
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
                                        {success}
                                    </h3>
                                </motion.div>

                                {txHash && (
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                                            <div className="flex items-center space-x-2">
                                                <code className="text-indigo-400 bg-black/30 px-4 py-2 rounded-lg text-sm break-all">
                                                    {txHash}
                                                </code>
                                                <a
                                                    href={`${MONAD_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        {imageUrl && (
                                            <motion.div
                                                variants={itemVariants}
                                                className="relative"
                                            >
                                                <p className="text-sm text-gray-400 mb-2">Your Champion's NFT:</p>
                                                <div className="relative aspect-square w-full max-w-[300px] mx-auto rounded-xl overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-500/10">
                                                    <img
                                                        src={imageUrl}
                                                        alt="Champion's NFT"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', imageUrl);
                                                            setError("Failed to load NFT image. Please try again later.");
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 max-w-3xl mx-auto"
                    >
                        <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                        <div>
                            <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                            <p className="text-red-300">{error}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Monad; 