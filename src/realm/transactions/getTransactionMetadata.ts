import { Transaction, TransactionEffect } from '@/api/types';
import { formatTransactionAddress } from '@/screens/Transactions/utils/formatAddress';

import { TRANSACTION_TYPES, TYPE_ERC1155, TYPE_ERC721 } from './const';

import loc from '/loc';

export interface TransactionStatus {
  status?: 'succeeded' | 'failed';
}

export interface ContractInteractionData extends TransactionStatus {
  kind: 'contract';
  type: TRANSACTION_TYPES.CONTRACT_INTERACTION;
  effects: TransactionEffect[];
}

export interface SimpleTransactionData extends TransactionStatus {
  kind: 'simple';
  type:
    | TRANSACTION_TYPES.SEND
    | TRANSACTION_TYPES.DEPOSIT
    | TRANSACTION_TYPES.TOKEN_APPROVAL
    | TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED
    | TRANSACTION_TYPES.RECEIVE
    | TRANSACTION_TYPES.MINT;
  effect: {
    amount: string;
    assetId: string;
  };
  description?: string;
}

export interface NFTTransactionData extends TransactionStatus {
  kind: 'nft';
  type: TRANSACTION_TYPES.NFT_SEND | TRANSACTION_TYPES.NFT_RECEIVE | TRANSACTION_TYPES.NFT_BUY | TRANSACTION_TYPES.NFT_MINT;
  nft: {
    assetId: string;
    amount?: string;
  };
  paymentToken?: {
    amount: string;
    assetId: string;
  };
}

export interface SwapTransactionData extends TransactionStatus {
  kind: 'swap';
  type: TRANSACTION_TYPES.SWAP;
  sent: {
    amount: string;
    assetId: string;
  };
  receive: {
    amount: string;
    assetId: string;
  };
}

export type TransactionData = ContractInteractionData | SimpleTransactionData | SwapTransactionData | NFTTransactionData;

export type MinimalTransaction = Pick<Transaction, 'effects'> & { status?: TransactionStatus['status'] };

function assetIsNFT(assetId: string) {
  if (assetId.includes('spl:')) {
    return assetId.includes('?nft');
  }
  return assetId.includes(TYPE_ERC721) || assetId.includes(TYPE_ERC1155);
}

export const TransactionTypeTitles: { [key in TRANSACTION_TYPES]: string } = {
  [TRANSACTION_TYPES.CONTRACT_INTERACTION]: loc.transactionTile.type.contractInteraction,
  [TRANSACTION_TYPES.RECEIVE]: loc.transactionTile.type.receive,
  [TRANSACTION_TYPES.SEND]: loc.transactionTile.type.send,
  [TRANSACTION_TYPES.NFT_RECEIVE]: loc.transactionTile.type.NFTReceive,
  [TRANSACTION_TYPES.NFT_SEND]: loc.transactionTile.type.NFTsend,
  [TRANSACTION_TYPES.TOKEN_APPROVAL]: loc.transactionTile.type.tokenApproval,
  [TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED]: loc.transactionTile.type.tokenApproval,
  [TRANSACTION_TYPES.MINT]: loc.transactionTile.type.mint,
  [TRANSACTION_TYPES.DEPOSIT]: loc.transactionTile.type.deposit,
  [TRANSACTION_TYPES.NFT_MINT]: loc.transactionTile.type.mint,
  [TRANSACTION_TYPES.NFT_BUY]: loc.transactionTile.type.NFTBuy,
  [TRANSACTION_TYPES.NFT_SELL]: loc.transactionTile.type.NFTSell,
  [TRANSACTION_TYPES.SWAP]: loc.transactionTile.type.swap,
};

const isTokenApprovalUnlimited = (amount?: string) => {
  if (amount === undefined || amount === '0' || amount === '') {
    return true;
  }

  const unlimitedMinNumber = 10 ** 48;
  const isUnlimited = Number(amount ?? '0') >= unlimitedMinNumber;

  return isUnlimited;
};

export const getTransactionMetadata = (tx: MinimalTransaction): TransactionData => {
  const effects = tx.effects ?? [];
  const status = tx.status;

  switch (effects.length) {
    case 0:
      return { kind: 'contract', type: TRANSACTION_TYPES.CONTRACT_INTERACTION, effects, status };

    case 1:
      const effect = effects[0];

      const effectType = effect.type;
      switch (effectType) {
        case 'receive':
          if (assetIsNFT(effect.assetId)) {
            return {
              kind: 'nft',
              type: TRANSACTION_TYPES.NFT_RECEIVE,
              nft: effect,
              status,
            };
          } else {
            return {
              kind: 'simple',
              type: TRANSACTION_TYPES.RECEIVE,
              effect,
              description: formatTransactionAddress(effect.sender, TRANSACTION_TYPES.RECEIVE),
              status,
            };
          }

        case 'send':
          if (assetIsNFT(effect.assetId)) {
            return {
              kind: 'nft',
              type: TRANSACTION_TYPES.NFT_SEND,
              nft: effect,
              status,
            };
          } else {
            return {
              kind: 'simple',
              type: TRANSACTION_TYPES.SEND,
              effect,
              description: formatTransactionAddress(effect.recipient, TRANSACTION_TYPES.SEND),
              status,
            };
          }

        case 'token-approval':
          return {
            kind: 'simple',
            type: isTokenApprovalUnlimited(effect.amount) ? TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED : TRANSACTION_TYPES.TOKEN_APPROVAL,
            effect: {
              amount: effect.amount ?? '1',
              assetId: effect.assetId,
            },
            status,
          };

        case 'swap':
          const { receive, spent } = effect;
          return {
            kind: 'swap',
            type: TRANSACTION_TYPES.SWAP,
            receive,
            sent: spent,
            status,
          };

        case 'purchase':
          if (assetIsNFT(effect.assetId)) {
            return {
              kind: 'nft',
              type: TRANSACTION_TYPES.NFT_BUY,
              nft: { assetId: effect.assetId, amount: effect.amount },
              paymentToken: effect.spentToken,
              status,
            };
          } else {
            return {
              kind: 'swap',
              type: TRANSACTION_TYPES.SWAP,
              receive: effect as { amount: string; assetId: string },
              sent: effect.spentToken,
              status,
            };
          }

        case 'mint':
          if (assetIsNFT(effect.assetId)) {
            if (effect.spentToken) {
              return {
                kind: 'nft',
                type: TRANSACTION_TYPES.NFT_BUY,
                nft: { assetId: effect.assetId, amount: effect.amount },
                paymentToken: effect.spentToken,
                status,
              };
            }
            return {
              kind: 'nft',
              type: TRANSACTION_TYPES.NFT_MINT,
              nft: effect,
              status,
            };
          } else {
            return {
              kind: 'simple',
              type: TRANSACTION_TYPES.MINT,
              effect: effect as { amount: string; assetId: string },
              status,
            };
          }

        case 'deposit':
          if (!(effect as any).depositedAmounts) {
            return { kind: 'contract', type: TRANSACTION_TYPES.CONTRACT_INTERACTION, effects: [], status };
          }
          if (effect.depositedAmounts.length == 0) {
            return { kind: 'contract', type: TRANSACTION_TYPES.CONTRACT_INTERACTION, effects: [], status };
          }

          return {
            kind: 'simple',
            type: TRANSACTION_TYPES.DEPOSIT,

            effect: effect.depositedAmounts[0] as { amount: string; assetId: string },
            status,
          };

        default:
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _exhaustiveCheck: never = effectType;
          return { kind: 'contract', type: TRANSACTION_TYPES.CONTRACT_INTERACTION, effects, status };
      }

    case 2:
      const nonApprovalEffects = effects.filter(e => e.type !== TRANSACTION_TYPES.TOKEN_APPROVAL);
      if (nonApprovalEffects.length === 1) {
        const effect = nonApprovalEffects[0];
        return getTransactionMetadata({ effects: [effect], status: status });
      }

      return {
        kind: 'contract',
        type: TRANSACTION_TYPES.CONTRACT_INTERACTION,
        effects,
        status,
      };

    default:
      return {
        kind: 'contract',
        type: TRANSACTION_TYPES.CONTRACT_INTERACTION,
        effects,
        status,
      };
  }
};
