import { SolanaRpcMethod } from '@/dAppIntegration/constants';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';

import { WALLET_CONNECT_ETH_SIGN_TYPES } from '../types';

import loc from '/loc';

export const TITLE_ALL_TRANSACTIONS_CONTRACT_INTERACTION = true;

export const getTransactionPageTitle = (transactionType: TRANSACTION_TYPES | undefined, options?: Partial<{ method: string; tokenSymbol: string }>) => {
  if (TITLE_ALL_TRANSACTIONS_CONTRACT_INTERACTION) {
    switch (transactionType) {
      case TRANSACTION_TYPES.SWAP: {
        return loc.appSignRequest.swap;
      }
      case TRANSACTION_TYPES.TOKEN_APPROVAL: {
        return loc.appSignRequest.approveSpendingCap;
      }
      case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
        return loc.formatString(loc.appSignRequest.allowAccess, { tokenSymbol: options?.tokenSymbol ?? '' });
      }
      case TRANSACTION_TYPES.DEPOSIT: {
        return loc.appSignRequest.deposit;
      }
    }

    if (options?.method === WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TRANSACTION || options?.method === SolanaRpcMethod.sol_signTransactions) {
      return loc.appSignRequest.sign;
    }

    return loc.appSignRequest.contractInteraction;
  }

  const mapping: { [key in TRANSACTION_TYPES]?: string } = {
    [TRANSACTION_TYPES.RECEIVE]: loc.appSignRequest.deposit,
    [TRANSACTION_TYPES.SEND]: loc.appSignRequest.withdrawal,
    [TRANSACTION_TYPES.TOKEN_APPROVAL]: loc.appSignRequest.approveSpendingCap,
    [TRANSACTION_TYPES.MINT]: loc.appSignRequest.mint,
    [TRANSACTION_TYPES.SWAP]: loc.appSignRequest.swap,
    [TRANSACTION_TYPES.CONTRACT_INTERACTION]: loc.appSignRequest.swap,
  };

  if (!transactionType || !(transactionType in mapping)) {
    return loc.appSignRequest.sign;
  }

  return mapping[transactionType]!;
};
