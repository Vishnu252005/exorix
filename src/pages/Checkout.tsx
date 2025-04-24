import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ChevronLeft, CreditCard, Truck, Shield, Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect, useBalance, useContractWrite, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { placeOrder } from '../firebase';
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from '../web3Config';
import { collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Add these contract ABIs
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

const NFT_CONTRACT_ADDRESS = "0xc4FEbC06ff857d8D34E11dF7f6d85B96ee90711A";
const NFT_CONTRACT_ABI = [
  "function mint() public",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"
];

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [currentTxHash, setCurrentTxHash] = useState<string>('');
  const [transactionDetails, setTransactionDetails] = useState<string>('');
  const [mintingStatus, setMintingStatus] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'submitted' | 'confirmed' | 'failed'>('idle');
  const [minting, setMinting] = useState<boolean>(false);

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });

  // Contract write function
  const { writeContract: makePayment, data: paymentTxHash } = useContractWrite({
    address: '0xYourContractAddress',
    abi: [
      {
        name: 'makePayment',
        type: 'function',
        stateMutability: 'payable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'makePayment',
  });

  // Transaction receipt hook
  const { isLoading: isPaymentLoading, isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash: paymentTxHash,
  });

  // Add contract write hook
  const { writeContract: distributeReward, data: claimTxHashData, error: claimErrorData } = useWriteContract();

  // Add transaction receipt hook
  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess, data: claimReceiptData } = useWaitForTransactionReceipt({
    hash: claimTxHashData,
  });

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCryptoPayment = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError('');
      setStatus('Initiating transaction...');
      setMinting(true);
      console.log('Starting payment...');
      
      const amount = BigInt(100) * BigInt(10 ** 18); // 100 tokens with 18 decimals
      console.log('Processing payment with params:', {
        address: address,
        amount: amount.toString()
      });

      await distributeReward({
        address: CONTRACT_ADDRESSES.distributor as `0x${string}`,
        abi: distributorABI,
        functionName: 'distributeRewards',
        args: [address, amount]
      });

      // Don't show success until transaction is confirmed
      setTransactionStatus('processing');
      setStatus('Please confirm the transaction in MetaMask...');
    } catch (err) {
      console.error('Error in handleCryptoPayment:', err);
      setError(`Failed to process payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('');
      setTransactionStatus('failed');
      setMintingStatus('Payment failed');
      toast.error('Payment failed');
    } finally {
      setMinting(false);
    }
  };

  // Update effect to handle transaction status
  useEffect(() => {
    const handleTransactionStatus = async () => {
      if (claimTxHashData) {
        console.log('Claim transaction submitted:', claimTxHashData);
        setStatus('Transaction submitted to blockchain');
        setTransactionStatus('submitted');
      }

      if (isClaimLoading) {
        console.log('Waiting for claim confirmation...');
        setStatus('Waiting for blockchain confirmation...');
      }

      if (claimReceiptData) {
        console.log('Claim receipt received:', claimReceiptData);
        const success = claimReceiptData.status === 'success';
        if (success) {
          setTransactionStatus('confirmed');
          setStatus('Payment successful! 🎉');
          
          // Check if order already exists
          const ordersRef = collection(db, 'orders');
          const q = query(ordersRef, where('transactionHash', '==', claimTxHashData));
          const querySnapshot = await getDocs(q);
          
          // Only create order if it doesn't exist
          if (querySnapshot.empty) {
            // Update order status
            const orderData = {
              items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
              })),
              totalAmount: 0, // Free minting
              paymentMethod: 'crypto',
              status: 'completed',
              transactionHash: claimTxHashData,
              nftMinted: true,
              createdAt: serverTimestamp()
            };
            
            try {
              await placeOrder(orderData);
              toast.success('Payment successful!');
              
              // Clear cart and redirect after 2 seconds
              clearCart();
              setTimeout(() => {
                navigate('/products');
              }, 2000);
            } catch (err) {
              console.error('Error placing order:', err);
              toast.error('Error updating order status');
            }
          }
        } else {
          setTransactionStatus('failed');
          setStatus('Transaction failed');
          toast.error('Payment failed');
        }
      }

      if (claimErrorData) {
        console.error('Claim error:', claimErrorData);
        setError(`Transaction failed: ${claimErrorData.message}`);
        setTransactionStatus('failed');
      }
    };

    handleTransactionStatus();
  }, [claimTxHashData, isClaimLoading, claimReceiptData, claimErrorData, cart, clearCart, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'crypto') {
      handleCryptoPayment();
      return;
    }

    setLoading(true);
    try {
      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in Firebase
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: totalPrice,
        paymentMethod: 'card',
        status: 'completed',
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zipCode: formData.zipCode
        }
      };

      const result = await placeOrder(orderData);
      
      if (result.success) {
        clearCart();
        toast.success('🎉 Order placed successfully! Thank you for your purchase.', {
          duration: 4000,
          icon: '🛍️'
        });
        // Show success message and redirect after 2 seconds
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
      setError(`Order failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderCryptoPayment = () => (
    <div className="space-y-6">
      {!isConnected ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => connect({ connector: connectors[0] })}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </motion.button>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Wallet Address</span>
                <span className="text-white font-mono text-sm">
                  {address && truncateAddress(address)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Balance</span>
                <span className="text-white">
                  {balance?.formatted} {balance?.symbol}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => disconnect()}
              className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Disconnect Wallet
            </motion.button>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400">Registration Fee</span>
              <span className="text-xl font-bold text-white">
                100 Tokens
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCryptoPayment}
              disabled={!isConnected || minting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {minting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Registration Fee</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Transaction Status */}
          {transactionStatus === 'confirmed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gray-900/50 space-y-3"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <p className="text-gray-300">Payment successful! 🎉</p>
              </div>

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
        </div>
      )}
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some products to your cart to checkout</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-xl p-6">
              {/* Connection Status */}
              <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gray-900/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-gray-300">
                    {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                  </span>
                </div>
                {isConnected && address && (
                  <div className="text-gray-400 flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>{truncateAddress(address)}</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-indigo-400">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 mt-6 pt-6">
                <div className="flex justify-between text-gray-400 mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Truck className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Free Shipping</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Secure Payment</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <CreditCard className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Easy Returns</p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'card' ? 'text-indigo-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    paymentMethod === 'card' ? 'text-indigo-400' : 'text-gray-400'
                  }`}>
                    Credit Card
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Wallet className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'crypto' ? 'text-indigo-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    paymentMethod === 'crypto' ? 'text-indigo-400' : 'text-gray-400'
                  }`}>
                    Crypto
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Forms */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {paymentMethod === 'card' ? 'Card Payment' : 'Crypto Payment'}
            </h2>

            {paymentMethod === 'crypto' ? renderCryptoPayment() : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-2">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-400 mb-2">
                      ZIP Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter ZIP code"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Card Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-400 mb-2">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-400 mb-2">
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          name="expiryDate"
                          required
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-400 mb-2">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          name="cvv"
                          required
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 