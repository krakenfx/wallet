type Utxo = {
  height: number;
  value: number;
  address: string;
  txId: string;
  vout: number;
};

export type VOut = {
  value: number;
  n: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
  } & ({ addresses: string[] } | { address: string } | Record<string, never>);
};

type Transaction = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: {
    txid: string;
    vout: number;
    scriptSig: { asm: string; hex: string };
    txinwitness: string[];
    sequence: number;
  }[];
  vout: VOut[];
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
};

export function getBalanceByAddress(address: string): Promise<{ confirmed: number; unconfirmed: number }>;


export function multiGetTransactionByTxid(txIds: string[], batchsize: number = 45, verbose: true = true): Promise<Record<string, Transaction>>;
export function multiGetTransactionByTxid(txIds: string[], batchsize: number, verbose: false): Promise<Record<string, string>>;

export function getTransactionsByAddress(address: string): Transaction[];

export function estimateCurrentBlockheight(): number;

export function broadcastV2(txhex: string): Promise<string>;
