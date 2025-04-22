export type TransactionReceipt = {
  blockHash: `0x${string}`;
  blockNumber: bigint;
  contractAddress: `0x${string}` | null;
  cumulativeGasUsed: bigint;
  effectiveGasPrice: bigint;
  from: `0x${string}`;
  gasUsed: bigint;
  logs: Array<any>;
  logsBloom: `0x${string}`;
  status: "success" | "failure" | "reverted";
  to: `0x${string}` | null;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  type: number;
  chainId?: number;
  blobGasPrice?: bigint;
  blobGasUsed?: bigint;
}; 