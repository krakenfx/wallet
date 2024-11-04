import * as web3 from '@solana/web3.js';
import bs58 from 'bs58';

import { Buffer } from 'buffer';

import type { SolanaSignTransaction } from './types';
import type { DefinitionList } from '../../types';


export function adaptSolanaSignTransactionToDefinitionList(data: SolanaSignTransaction): DefinitionList {
  const definitionList: DefinitionList = [];

  Object.entries(data).forEach(([key, value]) => {
    definitionList.push({ title: key, description: typeof value === 'string' ? value : JSON.stringify(value) });
  });

  return definitionList;
}

export function getWalletConnectRespondSessionRequestResult(transaction: SolanaSignTransaction, signedTransaction: string): { signature: string } {
  let result: { signature: string };
  const isLegacyTransaction = 'instructions' in transaction;

  if (isLegacyTransaction) {
    const signedTransaction_ = web3.Transaction.from(Buffer.from(signedTransaction, 'base64'));

    result = { signature: signedTransaction_.signature ? bs58.encode(signedTransaction_.signature) : '' };
  } else {
    const signedTransaction_ = web3.VersionedTransaction.deserialize(Buffer.from(signedTransaction, 'base64'));

    result = { signature: bs58.encode(signedTransaction_.signatures[0]) };
  }

  return result;
}
