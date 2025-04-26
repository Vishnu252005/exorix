"use client";

import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";
import { toast } from "sonner";

export function SendTransaction() {
  const { address, isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const { sendTransaction } = useSendTransaction();

  const handleSend = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsPending(true);
      const result = await sendTransaction({
        to: "0xFc76726aE77373BD6B000531a132391c820009C2" as `0x${string}`,
        value: parseEther("0.00001"),
      });
      
      toast.success("Transaction sent!");
      console.log("Transaction hash:", result);
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please check console for details.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) {
    return <div className="text-center">Please connect your wallet first</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Send Transaction</h2>
      <div className="space-y-2">
        <div className="p-4 border rounded bg-gray-50">
          <p className="font-medium">Recipient Address:</p>
          <p className="font-mono text-sm break-all">0xFc76726aE77373BD6B000531a132391c820009C2</p>
          <p className="mt-2 font-medium">Amount:</p>
          <p className="font-mono">0.00001 ETH</p>
        </div>
      </div>
      <button
        onClick={handleSend}
        disabled={isPending}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send 0.00001 ETH"}
      </button>
      {address && (
        <div className="text-sm text-gray-500">
          Connected as: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
} 