import * as web3 from '@solana/web3.js';

export enum WALLET_CONNECT_SOLANA_SIGN_TYPES {
  SIGN_MESSAGE = 'solana_signMessage',
  SIGN_TRANSACTION = 'solana_signTransaction',
}

export type SolanaSignMessage = {
  message: string;
  pubkey: string;
};

type SolanaSignTransactionWithDeprecatedFields = {
  feePayer: string;
  instructions: [
    {
      programId: string;
      data?: string;
      keys: {
        isSigner: boolean;
        isWritable: boolean;
        pubkey: string;
      }[];
    },
  ];
  recentBlockhash: string;
  partialSignatures: {
    pubkey: string;
    signature: string;
  }[];
  signatures: {
    publicKey: string;
    signature: string;
  }[];
} & SolanaSignTransactionRequiredFields;

type SolanaSignTransactionRequiredFields = {
  transaction: string; 
};


export type SolanaSignTransaction = SolanaSignTransactionWithDeprecatedFields | SolanaSignTransactionRequiredFields;

export type SolanaSignTransactionWeb3JS = {
  feePayer: web3.PublicKey;
  instructions: [
    {
      programId: string;
      data?: string;
      keys: {
        isSigner: boolean;
        isWritable: boolean;
        pubkey: string;
      }[];
    },
  ];
  recentBlockhash: string;
  partialSignatures?: {
    pubkey: web3.PublicKey;
    signature: string;
  }[];
  signatures: {
    publicKey: web3.PublicKey;
    signature: Buffer;
  }[];
  transaction: string; 
};
