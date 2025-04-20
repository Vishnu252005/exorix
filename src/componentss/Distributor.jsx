import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '../web3Config';

// Import your Distributor ABI
// You'll need to replace this with your actual ABI
const DistributorABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "distributeRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/**
 * Distributor component for interacting with the Distributor contract
 * 
 * @returns {React.ReactElement} Distributor component
 */
export function Distributor() {
  const { address, isConnected } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  // Write contract for distributing rewards
  const { writeContract, isPending } = useWriteContract();
  
  const handleDistributeRewards = () => {
    if (!recipientAddress || !amount) return;
    
    writeContract({
      address: CONTRACT_ADDRESSES.distributor,
      abi: DistributorABI,
      functionName: 'distributeRewards',
      args: [recipientAddress, parseUnits(amount, 18)], // Assuming 18 decimals
    });
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Distribute Rewards</h3>
      
      {isConnected ? (
        <div className="space-y-4">
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
              Amount to Distribute
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter amount to distribute"
            />
          </div>
          
          <button
            onClick={handleDistributeRewards}
            disabled={isPending || !recipientAddress || !amount}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Distributing...' : 'Distribute Rewards'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Please connect your wallet to distribute rewards.</p>
      )}
    </div>
  );
} 