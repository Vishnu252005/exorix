"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import {
  useAccount,
  useConnect,
  usePublicClient,
  useSignMessage,
  useDisconnect,
} from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/lib/wagmi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { truncateText } from "@/utils/truncateText";

export function ConnectAndSIWE() {
  const { showSuccess, showError } = useToast();
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState<Hex | undefined>(undefined);

  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        const address = data.accounts[0];
        const chainId = data.chainId;

        showSuccess("Connected!", `Address: ${truncateText(address)}`);

        try {
          const m = new SiweMessage({
            domain: window.location.host,
            address,
            chainId,
            uri: window.location.origin,
            version: "1",
            statement: "Smart Wallet SIWE Example",
            nonce: "12345678", // In production, use a random nonce
          });
          setMessage(m);
          const preparedMessage = m.prepareMessage();
          signMessage({
            account: address as `0x${string}`,
            message: preparedMessage,
          });
        } catch (error) {
          console.error("Error creating SIWE message:", error);
          showError("Error", "Failed to create sign-in message");
        }
      },
      onError: (error) => {
        console.error("Connection error:", error);
        showError(
          "Connection failed",
          error.message || "Could not connect wallet"
        );
      },
    },
  });

  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        showSuccess("Disconnected", "Your wallet Disconnectd Successfully");
      },
      onError: (error) => {
        console.error("Disconnection error:", error);
        showError(
          "Disconnection failed",
          error.message || "Could not disconnect your wallet"
        );
      },
    },
  });

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (sig) => {
        setSignature(sig);
        showSuccess(
          "Message signed",
          "Successfully signed authentication message"
        );
      },
      onError: (error) => {
        console.error("Signing error:", error);
        showError("Signing failed", error.message || "Could not sign message");
      },
    },
  });

  const [message, setMessage] = useState<SiweMessage | undefined>(undefined);
  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client || !message) return;

    try {
      const isValid = await client.verifyMessage({
        address: account.address,
        message: message.prepareMessage(),
        signature,
      });
      setValid(isValid);

      if (isValid) {
        showSuccess("Verification successful", "Your signature is valid");
      } else {
        showError("Verification failed", "Signature could not be verified");
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  }, [signature, account, client, message, showError, showSuccess]);

  useEffect(() => {
    if (signature) {
      checkValid();
    }
  }, [signature, checkValid]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Smart Wallet Demo</CardTitle>
        <CardDescription>
          Connect your smart wallet and sign a message
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => connect({ connector: cbWalletConnector })}
          className="w-full"
          disabled={Boolean(account.address)}
        >
          {account.address ? "Connected" : "Connect Smart Wallet"}
        </Button>

        {account.address && (
          <div className="p-4 border rounded-md bg-slate-50">
            <p className="font-medium">Connected Address:</p>
            <p className="font-mono text-sm break-all">{account.address}</p>
          </div>
        )}

        {signature && (
          <div className="p-4 border rounded-md bg-slate-50">
            <p className="font-medium">Signature:</p>
            <p className="font-mono text-xs break-all">{signature}</p>
          </div>
        )}

        {valid !== undefined && (
          <div
            className={`p-4 border rounded-md ${
              valid ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className="font-medium">Verification Status:</p>
            <p>{valid ? "✅ Signature Valid" : "❌ Signature Invalid"}</p>
          </div>
        )}

        {/* Disconnect button */}
        {account.address && (
          <Button
            onClick={() => disconnect()}
            variant="secondary"
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white"
          >
            Disconnect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
