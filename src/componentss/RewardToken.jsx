import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '../web3Config';

// Import your RewardToken ABI
// You'll need to replace this with your actual ABI
const RewardTokenABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * RewardToken component for interacting with the RewardToken contract
 * 
 * @returns {React.ReactElement} RewardToken component
 */
export function RewardToken() {
  const { address, isConnected } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  // Read balance
  const { data: balanceData, isLoading: isBalanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardToken,
    abi: RewardTokenABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    enabled: Boolean(address && isConnected),
  });
  
  // Write contract for minting (this would typically be called by the owner/admin)
  const { writeContract, isPending } = useWriteContract();
  
  const handleMintTokens = () => {
    if (!recipientAddress || !amount) return;
    
    writeContract({
      address: CONTRACT_ADDRESSES.rewardToken,
      abi: RewardTokenABI,
      functionName: 'mint',
      args: [recipientAddress, parseUnits(amount, 18)], // Assuming 18 decimals
    });
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Reward Token</h3>
      
      {isConnected ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Your Balance:</p>
            <p className="text-lg font-semibold">
              {isBalanceLoading ? 'Loading...' : 
                balanceData ? `${formatUnits(balanceData, 18)} ADR` : '0 ADR'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter recipient address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Mint
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter amount to mint"
            />
          </div>
          
          <button
            onClick={handleMintTokens}
            disabled={isPending || !recipientAddress || !amount}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Minting...' : 'Mint Tokens'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Please connect your wallet to interact with tokens.</p>
      )}
    </div>
  );
} 