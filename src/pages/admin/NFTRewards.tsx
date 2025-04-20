import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trophy, Edit2, Trash2, Image as ImageIcon, Save, X, Search, Filter, UploadCloud } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NFTReward {
    id: string;
    name: string;
    contractAddress: string;  // Required: The NFT contract address
    tokenURI: string;        // Required: The metadata URL for the NFT
    description: string;
    status: 'active' | 'claimed' | 'expired';
    createdBy: string;
    createdAt: Timestamp;
    claimedBy: string | null;
    mintDate: string | null;
    couponCode: string;      // Required: The coupon code for claiming the NFT
}

interface FormData {
    name: string;
    contractAddress: string;
    tokenURI: string;
    description: string;
    status: 'active' | 'claimed' | 'expired';
    couponCode: string;
}

const NFTRewards: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [rewards, setRewards] = useState<NFTReward[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingReward, setEditingReward] = useState<NFTReward | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'claimed' | 'expired'>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        contractAddress: "",
        tokenURI: "",
        couponCode: "",
        status: "active"
    });

    // Check if user is authenticated and get admin status
    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
                navigate('/signin');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setIsAdmin(userDoc.data()?.isAdmin || false);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error checking user status:', err);
                setError('Failed to verify user permissions');
                setLoading(false);
            }
        };

        checkUser();
    }, [user, navigate]);

    // Fetch NFT rewards
    useEffect(() => {
        const fetchRewards = async () => {
            if (!user) return;

            try {
                const nftCollection = collection(db, 'nft');
                const q = query(nftCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const rewardsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as NFTReward[];
                setRewards(rewardsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching NFT rewards:', err);
                setError('Failed to load NFT rewards');
                setLoading(false);
            }
        };

        fetchRewards();
    }, [user]);

    const handleCreateReward = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create reward triggered", formData); // Debug log
        if (!user) {
            setError("You must be logged in to create rewards");
            return;
        }

        try {
            setLoading(true);
            setError("");
            console.log("Validating fields..."); // Debug log

            // Validate required fields
            if (!formData.contractAddress || !formData.tokenURI || !formData.couponCode) {
                throw new Error("Contract address, token URI, and coupon code are required");
            }

            // Validate contract address format
            if (!/^0x[a-fA-F0-9]{40}$/.test(formData.contractAddress)) {
                throw new Error("Invalid contract address format. Must be a valid Ethereum address starting with 0x");
            }

            // Validate coupon code format
            if (!/^[A-Za-z0-9_]+$/.test(formData.couponCode)) {
                throw new Error("Coupon code can only contain letters, numbers, and underscores");
            }

            console.log("Checking for duplicate coupon..."); // Debug log
            // Check if coupon code is already in use
            const couponQuery = query(
                collection(db, 'nft'),
                where('couponCode', '==', formData.couponCode.toUpperCase())
            );
            
            const couponSnapshot = await getDocs(couponQuery);
            if (!couponSnapshot.empty) {
                throw new Error("This coupon code is already in use");
            }

            console.log("Creating new reward..."); // Debug log
            // Create the new reward
            const newReward = {
                name: formData.name || "Untitled Reward",
                description: formData.description || "",
                contractAddress: formData.contractAddress,
                tokenURI: formData.tokenURI,
                couponCode: formData.couponCode.toUpperCase(),
                status: formData.status || "active",
                createdBy: user.uid,
                createdAt: Timestamp.now(),
                claimedBy: null,
                mintDate: null
            };

            console.log("Saving to Firestore...", newReward); // Debug log
            const docRef = await addDoc(collection(db, 'nft'), newReward);
            
            // Add the new reward to the local state
            setRewards(prev => [{
                ...newReward,
                id: docRef.id
            }, ...prev]);

            setSuccess("NFT reward created successfully!");
            setIsCreating(false);
            setFormData({
                name: "",
                description: "",
                contractAddress: "",
                tokenURI: "",
                couponCode: "",
                status: "active"
            });
        } catch (error: any) {
            console.error("Error creating reward:", error); // Debug log
            setError(error.message || "Error creating NFT reward");
            // Keep the modal open when there's an error
            setIsCreating(true);
        } finally {
            setLoading(false);
        }
    };

    const canModifyReward = (reward: NFTReward) => {
        return isAdmin || reward.createdBy === user?.uid;
    };

    const handleEditClick = (reward: NFTReward) => {
        if (!canModifyReward(reward)) {
            setError('You do not have permission to edit this reward');
            return;
        }
        setEditingReward(reward);
        setIsEditing(true);
        setFormData({
            name: reward.name,
            description: reward.description,
            contractAddress: reward.contractAddress,
            tokenURI: reward.tokenURI,
            couponCode: reward.couponCode,
            status: reward.status
        });
    };

    const handleEditReward = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !editingReward) return;

        try {
            setLoading(true);
            setError("");

            // Validate required fields
            if (!formData.contractAddress || !formData.tokenURI || !formData.couponCode) {
                throw new Error("Contract address, token URI, and coupon code are required");
            }

            // Validate contract address format
            if (!/^0x[a-fA-F0-9]{40}$/.test(formData.contractAddress)) {
                throw new Error("Invalid contract address format");
            }

            // Validate coupon code format
            if (!/^[A-Za-z0-9_]+$/.test(formData.couponCode)) {
                throw new Error("Coupon code can only contain letters, numbers, and underscores");
            }

            // Check if coupon code is already used by another NFT
            try {
                const couponQuery = query(
                    collection(db, 'nft'),
                    where('couponCode', '==', formData.couponCode.toUpperCase()),
                    where('id', '!=', editingReward.id)
                );
                const couponSnapshot = await getDocs(couponQuery);
                if (!couponSnapshot.empty) {
                    throw new Error("This coupon code is already in use");
                }
            } catch (error: any) {
                // If the error is about missing index, we'll do a simple check instead
                if (error.message?.includes('requires an index')) {
                    const allRewards = await getDocs(collection(db, 'nft'));
                    const isDuplicate = allRewards.docs.some(doc => 
                        doc.id !== editingReward.id && 
                        doc.data().couponCode === formData.couponCode.toUpperCase()
                    );
                    if (isDuplicate) {
                        throw new Error("This coupon code is already in use");
                    }
                } else {
                    throw error;
                }
            }

            // Update the existing document
            const rewardRef = doc(db, 'nft', editingReward.id);
            await updateDoc(rewardRef, {
                name: formData.name,
                description: formData.description,
                contractAddress: formData.contractAddress,
                tokenURI: formData.tokenURI,
                couponCode: formData.couponCode.toUpperCase(),
                status: formData.status,
                updatedAt: Timestamp.now()
            });

            // Update local state
            setRewards(rewards.map(reward => 
                reward.id === editingReward.id 
                    ? { 
                        ...reward, 
                        name: formData.name,
                        description: formData.description,
                        contractAddress: formData.contractAddress,
                        tokenURI: formData.tokenURI,
                        couponCode: formData.couponCode.toUpperCase(),
                        status: formData.status
                    }
                    : reward
            ));

            setSuccess("NFT reward updated successfully!");
            setEditingReward(null);
            setIsEditing(false);
            setFormData({
                name: "",
                description: "",
                contractAddress: "",
                tokenURI: "",
                couponCode: "",
                status: "active"
            });
        } catch (error: any) {
            setError(error.message || "Error updating NFT reward");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReward = async (id: string) => {
        if (!user) return;

        try {
            const reward = rewards.find(r => r.id === id);
            if (!reward || !canModifyReward(reward)) {
                setError('You do not have permission to delete this reward');
                return;
            }

            await deleteDoc(doc(db, 'nft', id));
            setRewards(prev => prev.filter(reward => reward.id !== id));
        } catch (err) {
            console.error('Error deleting NFT reward:', err);
            setError('Failed to delete NFT reward');
        }
    };

    const filteredRewards = rewards.filter(reward => {
        const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            reward.contractAddress.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reward.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Add loading state for admin check
    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Add error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#1F1F23] to-[#0A0A0B] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">NFT Rewards Management</h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
                        aria-label="Create new NFT reward"
                        title="Create new NFT reward"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New Reward</span>
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search rewards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Search rewards"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="text-gray-400 w-5 h-5" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Filter rewards by status"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="claimed">Claimed</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>

                {/* Create/Edit Form Modal */}
                {(isCreating || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {isCreating ? 'Create New NFT Reward' : 'Edit NFT Reward'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                        setError(null);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Close modal"
                                    title="Close modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={isCreating ? handleCreateReward : handleEditReward} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Contract Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contractAddress}
                                        onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                                        placeholder="0x..."
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Must be a valid Ethereum address starting with 0x</p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Token URI *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.tokenURI}
                                        onChange={(e) => setFormData({ ...formData, tokenURI: e.target.value })}
                                        placeholder="https:// or ipfs://"
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">The metadata URL for your NFT</p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Coupon Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.couponCode}
                                        onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                        placeholder="e.g., MONAD_WINNER_2024"
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">This code will be required to claim the NFT</p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'claimed' | 'expired' })}
                                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="claimed">Claimed</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setIsEditing(false);
                                            setError(null);
                                        }}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{isCreating ? 'Create Reward' : 'Save Changes'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* Rewards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map(reward => (
                        <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                        >
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                                <img
                                    src={reward.tokenURI}
                                    alt={reward.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`
                                        px-2 py-1 rounded-full text-xs font-medium
                                        ${reward.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                          reward.status === 'claimed' ? 'bg-blue-500/20 text-blue-400' :
                                          'bg-red-500/20 text-red-400'}
                                    `}>
                                        {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                            <p className="text-gray-400 text-sm mb-4">{reward.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <Trophy className="w-4 h-4 text-purple-400 mr-2" />
                                    <span className="text-gray-300">{reward.contractAddress}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-400">Token URI:</span>
                                    <code className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded ml-2">
                                        {reward.tokenURI}
                                    </code>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-400">Coupon Code:</span>
                                    <code className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded ml-2">
                                        {reward.couponCode}
                                    </code>
                                </div>
                            </div>

                            {canModifyReward(reward) && (
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleEditClick(reward)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        aria-label={`Edit ${reward.name}`}
                                        title={`Edit ${reward.name}`}
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReward(reward.id)}
                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        aria-label={`Delete ${reward.name}`}
                                        title={`Delete ${reward.name}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NFTRewards;