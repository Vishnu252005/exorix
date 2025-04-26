import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ExternalLink, Trophy, Sparkles, Medal, Star, Lock, Unlock, Gift, Timer, Target, Zap, Crown, Flame, Bolt, Award, Trophy as TrophyIcon, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, addDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';
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

interface Target {
    id: number;
    x: number;
    y: number;
    visible: boolean;
    clicked: boolean;
    type: 'normal' | 'fake' | 'bonus';
}

interface LeaderboardEntry {
    score: number;
    bestTime: number;
    date: string;
}

// Add shape types
const SHAPE_TYPES = ['circle', 'square', 'triangle', 'star', 'hexagon'] as const;
type ShapeType = typeof SHAPE_TYPES[number];

const SHAPE_COLORS = [
    'bg-yellow-400', 'bg-pink-500', 'bg-blue-400', 'bg-green-400', 'bg-purple-500', 'bg-red-400', 'bg-orange-400'
];

interface ShapeTarget {
    id: number;
    type: ShapeType;
    color: string;
    x: number;
    y: number;
}

interface GameState {
    isPlaying: boolean;
    startTime: number | null;
    reactionTime: number | null;
    bestTime: number | null;
    showTarget: boolean;
    gameCount: number;
    achievements: {
        firstGame: boolean;
        under300ms: boolean;
        under200ms: boolean;
        under100ms: boolean;
        tenGames: boolean;
        perfectGame: boolean;
        speedMaster: boolean;
        rushMaster: boolean;
    };
    targetSize: number;
    targetPosition: { x: number; y: number };
    countdown: number | null;
    isMuted: boolean;
    streak: number;
    combo: number;
    lastReactionTime: number | null;
    showCombo: boolean;
    targets: Target[];
    currentTargetIndex: number;
    rushMode: boolean;
    score: number;
    multiplier: number;
    finished: boolean;
    level: number;
    leaderboard: LeaderboardEntry[];
    currentShape: ShapeTarget | null;
    lastShapePosition: { x: number; y: number } | null;
    shapeCount: number;
}

interface FirestoreLeaderboardEntry {
    id?: string;
    player: string;
    score: number;
    bestTime: number;
    date: string;
    uid: string;
    email: string;
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
    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        startTime: null,
        reactionTime: null,
        bestTime: null,
        showTarget: false,
        gameCount: 0,
        achievements: {
            firstGame: false,
            under300ms: false,
            under200ms: false,
            under100ms: false,
            tenGames: false,
            perfectGame: false,
            speedMaster: false,
            rushMaster: false
        },
        targetSize: 80,
        targetPosition: { x: 50, y: 50 },
        countdown: null,
        isMuted: false,
        streak: 0,
        combo: 0,
        lastReactionTime: null,
        showCombo: false,
        targets: [],
        currentTargetIndex: 0,
        rushMode: false,
        score: 0,
        multiplier: 1,
        finished: false,
        level: 1,
        leaderboard: [],
        currentShape: null,
        lastShapePosition: null,
        shapeCount: 0
    });
    const [firebaseLeaderboard, setFirebaseLeaderboard] = useState<FirestoreLeaderboardEntry[]>([]);

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

    // Sound effects
    const playSound = (sound: 'click' | 'success' | 'countdown' | 'combo') => {
        if (gameState.isMuted) return;
        
        const sounds = {
            click: new Audio('/sounds/click.mp3'),
            success: new Audio('/sounds/success.mp3'),
            countdown: new Audio('/sounds/countdown.mp3'),
            combo: new Audio('/sounds/combo.mp3')
        };
        
        sounds[sound].play().catch(() => {});
    };

    const getRandomTargetType = (level: number): 'normal' | 'fake' | 'bonus' => {
        const rand = Math.random();
        if (level > 2 && rand < 0.15) return 'fake';
        if (level > 1 && rand > 0.85) return 'bonus';
        return 'normal';
    };

    const generateTargets = (count: number, level: number): Target[] => {
        const targets = [];
        for (let i = 0; i < count; i++) {
            targets.push({
                id: i,
                x: Math.random() * 70 + 15,
                y: Math.random() * 70 + 15,
                visible: false,
                clicked: false,
                type: getRandomTargetType(level)
            });
        }
        return targets;
    };

    const saveLeaderboard = (score: number, bestTime: number) => {
        const entry: LeaderboardEntry = {
            score,
            bestTime,
            date: new Date().toLocaleString()
        };
        let leaderboard = JSON.parse(localStorage.getItem('reaction_leaderboard') || '[]');
        leaderboard.push(entry);
        leaderboard = leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score).slice(0, 5);
        localStorage.setItem('reaction_leaderboard', JSON.stringify(leaderboard));
        setGameState(prev => ({ ...prev, leaderboard }));
    };

    const getRandomShape = (excludePos?: { x: number; y: number }): ShapeTarget => {
        let x, y;
        do {
            x = Math.random() * 70 + 15;
            y = Math.random() * 70 + 15;
        } while (excludePos && Math.abs(x - excludePos.x) < 10 && Math.abs(y - excludePos.y) < 10);
        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
            color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
            x,
            y
        };
    };

    const startGame = () => {
        setGameState(prev => ({
            ...prev,
            isPlaying: true,
            showTarget: false,
            startTime: null,
            reactionTime: null,
            countdown: 3,
            streak: 0,
            combo: 0,
            score: 0,
            multiplier: 1,
            finished: false,
            currentShape: null,
            lastShapePosition: null,
            shapeCount: 0
        }));
        playSound('countdown');
    };

    // Countdown effect
    useEffect(() => {
        if (gameState.isPlaying && gameState.countdown !== null) {
            if (gameState.countdown > 0) {
                const timer = setTimeout(() => {
                    setGameState(prev => ({ ...prev, countdown: prev.countdown! - 1 }));
                }, 1000);
                return () => clearTimeout(timer);
            } else if (gameState.countdown === 0) {
                setGameState(prev => ({
                    ...prev,
                    countdown: null,
                    currentShape: getRandomShape(),
                    startTime: Date.now(),
                    shapeCount: 1
                }));
            }
        }
    }, [gameState.isPlaying, gameState.countdown]);

    const handleShapeClick = () => {
        playSound('click');
        setGameState(prev => {
            const now = Date.now();
            const reactionTime = prev.startTime ? now - prev.startTime : 0;
            const newScore = prev.score + Math.max(10, 200 - reactionTime);
            const newStreak = prev.streak + 1;
            const newCombo = newStreak >= 3 ? prev.combo + 1 : prev.combo;
            const newShape = getRandomShape(prev.currentShape ? { x: prev.currentShape.x, y: prev.currentShape.y } : undefined);
            return {
                ...prev,
                score: newScore,
                streak: newStreak,
                combo: newCombo,
                showCombo: newCombo > prev.combo,
                lastReactionTime: reactionTime,
                bestTime: prev.bestTime ? Math.min(prev.bestTime, reactionTime) : reactionTime,
                currentShape: newShape,
                lastShapePosition: prev.currentShape ? { x: prev.currentShape.x, y: prev.currentShape.y } : null,
                shapeCount: prev.shapeCount + 1,
                startTime: Date.now()
            };
        });
        setTimeout(() => {
            setGameState(prev => ({ ...prev, showCombo: false }));
        }, 1000);
    };

    // On finish, save to leaderboard and advance level
    useEffect(() => {
        if (gameState.finished && (gameState.score > 0 || gameState.bestTime)) {
            saveLeaderboard(gameState.score, gameState.bestTime || 0);
            setTimeout(() => {
                setGameState(prev => ({ ...prev, level: prev.level + 1 }));
            }, 1000);
        }
    }, [gameState.finished]);

    const getAchievementIcon = (achievement: string) => {
        switch (achievement) {
            case 'firstGame': return <TrophyIcon className="w-5 h-5 text-yellow-400" />;
            case 'under300ms': return <Bolt className="w-5 h-5 text-blue-400" />;
            case 'under200ms': return <Flame className="w-5 h-5 text-orange-400" />;
            case 'under100ms': return <Crown className="w-5 h-5 text-purple-400" />;
            case 'tenGames': return <Award className="w-5 h-5 text-pink-400" />;
            case 'perfectGame': return <TrophyIcon className="w-5 h-5 text-yellow-400" />;
            case 'speedMaster': return <Bolt className="w-5 h-5 text-purple-400" />;
            case 'rushMaster': return <Bolt className="w-5 h-5 text-purple-400" />;
            default: return null;
        }
    };

    // Real-time leaderboard listener
    useEffect(() => {
        const leaderboardQuery = query(
            collection(db, 'reaction_leaderboard'),
            orderBy('score', 'desc'),
            limit(10)
        );
        const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
            const entries: FirestoreLeaderboardEntry[] = [];
            snapshot.forEach(doc => {
                entries.push({ id: doc.id, ...doc.data() } as FirestoreLeaderboardEntry);
            });
            setFirebaseLeaderboard(entries);
        });
        return () => unsubscribe();
    }, []);

    // On game end, push to Firestore
    useEffect(() => {
        if (gameState.finished && gameState.score > 0 && user) {
            const playerName = (user && typeof (user as any).displayName === 'string' && (user as any).displayName)
                ? (user as any).displayName
                : (user?.email?.split('@')[0] || 'Player');
            const entry = {
                player: playerName,
                score: gameState.score,
                bestTime: gameState.bestTime || 0,
                date: new Date().toLocaleString(),
                uid: user.uid,
                email: user.email || ''
            };
            // Check if user already has an entry
            const leaderboardRef = collection(db, 'reaction_leaderboard');
            const q = query(leaderboardRef, where('uid', '==', user.uid));
            getDocs(q).then(snapshot => {
                if (!snapshot.empty) {
                    // Update if new score is higher
                    const docRef = doc(db, 'reaction_leaderboard', snapshot.docs[0].id);
                    const prev = snapshot.docs[0].data() as FirestoreLeaderboardEntry;
                    if (entry.score > prev.score) {
                        updateDoc(docRef, entry);
                    }
                } else {
                    addDoc(leaderboardRef, entry);
                }
            });
        }
    }, [gameState.finished, user]);

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

                {/* Enhanced Champion's Challenge Game Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 max-w-4xl mx-auto"
                >
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <Zap className="w-6 h-6 text-yellow-500 mr-3" />
                                Champion's Challenge
                            </h2>
                            <div className="flex items-center space-x-4">
                                {gameState.bestTime && (
                                    <div className="flex items-center space-x-2 text-yellow-400">
                                        <Trophy className="w-5 h-5" />
                                        <span>Best Time: {gameState.bestTime}ms</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Games: {gameState.gameCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-black/20 rounded-xl p-6 border border-gray-700/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center">
                                        <Target className="w-5 h-5 text-purple-400 mr-2" />
                                        Reaction Time Test
                                    </h3>
                                </div>

                                <p className="text-gray-400 mb-4">
                                    Test your champion's reflexes! Click the target as soon as it appears.
                                    The faster your reaction time, the better your score.
                                </p>

                                <div className="relative h-64 bg-black/30 rounded-xl border border-gray-700/30 overflow-hidden">
                                    {/* End Game button */}
                                    {gameState.isPlaying && gameState.countdown === null && !gameState.finished && (
                                        <button
                                            onClick={() => setGameState(prev => ({ ...prev, isPlaying: false, finished: true, currentShape: null }))}
                                            className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors"
                                        >
                                            End Game
                                        </button>
                                    )}
                                    {gameState.countdown !== null ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <span className="text-6xl font-bold text-purple-400">
                                                {gameState.countdown}
                                            </span>
                                        </motion.div>
                                    ) : !gameState.isPlaying && !gameState.finished ? (
                                        <button
                                            onClick={startGame}
                                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                        >
                                            <span className="text-white font-bold text-xl">Start Challenge</span>
                                        </button>
                                    ) : gameState.finished ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                            <span className="text-2xl font-bold text-green-400">Challenge Complete!</span>
                                            <button
                                                onClick={startGame}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                            >
                                                Play Again
                                            </button>
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            {gameState.currentShape && (
                                                <motion.button
                                                    key={gameState.currentShape.id}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    onClick={handleShapeClick}
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${gameState.currentShape.y}%`,
                                                        left: `${gameState.currentShape.x}%`,
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '70px',
                                                        height: '70px',
                                                        borderRadius: gameState.currentShape.type === 'circle' ? '50%' : gameState.currentShape.type === 'square' ? '8px' : '0',
                                                        clipPath: gameState.currentShape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                                          gameState.currentShape.type === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                                                          gameState.currentShape.type === 'hexagon' ? 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)' : 'none',
                                                        background: gameState.currentShape.color,
                                                    }}
                                                    className={gameState.currentShape.color + ' shadow-lg hover:scale-110 transition-transform duration-100'}
                                                />
                                            )}
                                        </AnimatePresence>
                                    )}
                                    {/* Combo Message */}
                                    {gameState.showCombo && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        >
                                            <span className="text-4xl font-bold text-yellow-400 animate-bounce">
                                                COMBO x{gameState.combo}!
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Stats Display */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    <div className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                                        <div className="text-sm text-gray-400">Score</div>
                                        <div className="text-xl font-bold text-purple-400">{gameState.score}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                                        <div className="text-sm text-gray-400">Multiplier</div>
                                        <div className="text-xl font-bold text-yellow-400">x{gameState.multiplier.toFixed(1)}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                                        <div className="text-sm text-gray-400">Streak</div>
                                        <div className="text-xl font-bold text-white">{gameState.streak}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-3 border border-gray-700/30">
                                        <div className="text-sm text-gray-400">Best Time</div>
                                        <div className="text-xl font-bold text-green-400">
                                            {gameState.bestTime ? `${gameState.bestTime}ms` : '-'}
                                        </div>
                                    </div>
                                </div>

                                {/* Sound Toggle */}
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        onClick={() => setGameState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                                        className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                                    >
                                        {gameState.isMuted ? (
                                            <VolumeX className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Volume2 className="w-5 h-5 text-purple-400" />
                                        )}
                                    </button>
                                </div>

                                {/* Achievements Section */}
                                <div className="mt-6">
                                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                        <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                                        Achievements
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(gameState.achievements).map(([key, achieved]) => (
                                            <div
                                                key={key}
                                                className={`flex items-center space-x-2 p-3 rounded-lg ${
                                                    achieved
                                                        ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20'
                                                        : 'bg-black/20 border border-gray-700/30'
                                                }`}
                                            >
                                                {getAchievementIcon(key)}
                                                <span className={`text-sm ${achieved ? 'text-white' : 'text-gray-500'}`}>
                                                    {key === 'firstGame' && 'First Game'}
                                                    {key === 'under300ms' && 'Under 300ms'}
                                                    {key === 'under200ms' && 'Under 200ms'}
                                                    {key === 'under100ms' && 'Under 100ms'}
                                                    {key === 'tenGames' && '10 Games Played'}
                                                    {key === 'perfectGame' && 'Perfect Game'}
                                                    {key === 'speedMaster' && 'Speed Master'}
                                                    {key === 'rushMaster' && 'Rush Master'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* After the game area, add a leaderboard display */}
                <div className="mt-8 max-w-md mx-auto">
                    <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700/40 shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <span className="mr-2">🌐</span> Global Leaderboard
                        </h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="text-gray-400 font-semibold pb-2">#</th>
                                    <th className="text-gray-400 font-semibold pb-2">Player</th>
                                    <th className="text-gray-400 font-semibold pb-2">Score</th>
                                    <th className="text-gray-400 font-semibold pb-2">Best Time</th>
                                    <th className="text-gray-400 font-semibold pb-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {firebaseLeaderboard.map((entry, idx) => {
                                    let rankIcon = '';
                                    if (idx === 0) rankIcon = '🥇';
                                    else if (idx === 1) rankIcon = '🥈';
                                    else if (idx === 2) rankIcon = '🥉';
                                    return (
                                        <tr key={entry.id || idx} className={`border-t border-gray-700/30 transition-colors hover:bg-gray-700/30`}>
                                            <td className="py-2 text-gray-300 text-lg">{rankIcon || idx + 1}</td>
                                            <td className="py-2 text-2xl">{entry.player}</td>
                                            <td className="py-2 text-yellow-400 font-bold text-lg">{entry.score}</td>
                                            <td className="py-2 text-green-400">{entry.bestTime}ms</td>
                                            <td className="py-2 text-gray-400 text-xs">{entry.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {firebaseLeaderboard.length === 0 && (
                            <div className="text-gray-500 text-center mt-4">No scores yet. Be the first to play!</div>
                        )}
                    </div>
                </div>

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