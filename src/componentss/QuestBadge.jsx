import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../web3Config';

// Import your QuestBadge ABI
// You'll need to replace this with your actual ABI
const QuestBadgeABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * QuestBadge component for interacting with the QuestBadge contract
 * 
 * @returns {React.ReactElement} QuestBadge component
 */
export function QuestBadge() {
  const { address, isConnected } = useAccount();
  const [tokenId, setTokenId] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  
  // Read token URI
  const { data: uriData, isLoading: isUriLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.questBadge,
    abi: QuestBadgeABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId || '0')],
    enabled: Boolean(tokenId && isConnected),
  });
  
  // Write contract for minting (this would typically be called by the owner/admin)
  const { writeContract, isPending } = useWriteContract();
  
  const handleMintBadge = () => {
    if (!address || !tokenURI) return;
    
    writeContract({
      address: CONTRACT_ADDRESSES.questBadge,
      abi: QuestBadgeABI,
      functionName: 'safeMint',
      args: [address, tokenURI],
    });
  };
  
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Quest Badge</h3>
      
      {isConnected ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token ID
            </label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter token ID"
            />
          </div>
          
          {tokenId && (
            <div>
              <p className="text-sm font-medium text-gray-700">Token URI:</p>
              <p className="text-sm text-gray-600">
                {isUriLoading ? 'Loading...' : uriData || 'No URI found'}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Badge URI
            </label>
            <input
              type="text"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter badge metadata URI"
            />
          </div>
          
          <button
            onClick={handleMintBadge}
            disabled={isPending || !tokenURI}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Minting...' : 'Mint Badge'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Please connect your wallet to interact with badges.</p>
      )}
    </div>
  );
} 