import { Transaction } from '@/api/types';
import { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';

import { formatAddress } from './formatAddress';

import loc from '/loc';

export type DefaultTransactionNotes = {
  address?: string;
  assetAmount?: string;
  assetSymbol?: string;
  assetAmountReceived?: string;
  assetSymbolReceived?: string;
  isUtxo?: boolean;
  nftName?: string;
  transactionState: Transaction['status'] | 'pending';
  transactionType?: TRANSACTION_TYPES | TRANSACTION_PENDING_TYPES;
  transactionTitle?: string;
};


export const getDefaultTransactionNotes = (config: DefaultTransactionNotes): string => {
  switch (config.transactionType) {
    
    case TRANSACTION_TYPES.NFT_BUY: {
      const args = {
        address: formatAddress(config.address ?? '', true),
        nftName: config.nftName ?? '',
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.nftBuy.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.nftBuy.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.nftBuy.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.NFT_SELL: {
      const args = {
        address: formatAddress(config.address ?? '', true),
        nftName: config.nftName ?? '',
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.nftSell.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.nftSell.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.nftSell.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.NFT_MINT: {
      const args = {
        address: formatAddress(config.address ?? '', true),
        nftName: config.nftName ?? '',
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.nftMint.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.nftMint.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.nftMint.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.NFT_SEND: {
      const args = {
        address: formatAddress(config.address ?? '', true),
        nftName: config.nftName ?? '',
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.nftSend.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.nftSend.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.nftSend.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.NFT_RECEIVE: {
      const args = {
        address: formatAddress(config.address ?? '', true),
        nftName: config.nftName ?? '',
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.nftReceive.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.nftReceive.pending, args).toString();
          break;
      }

      return result;
    }

    
    
    
    case TRANSACTION_PENDING_TYPES.SEND:
    case TRANSACTION_TYPES.SEND: {
      let result = '';

      if (config.isUtxo) {
        const args = {
          amount: `${config.assetAmount} ${config.assetSymbol}`,
        };

        
        
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.sendUtxo.succeeded, args).toString();
            break;
          case 'pending':
            result = loc.formatString(loc.transactionDetails.description.sendUtxo.pending, args).toString();
            break;
          case 'failed':
            result = loc.formatString(loc.transactionDetails.description.sendUtxo.failed, args).toString();
            break;
        }
      } else {
        const args = {
          amount: `${config.assetAmount} ${config.assetSymbol}`,
          address: formatAddress(config.address ?? '', true),
        };

        
        
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.send.succeeded, args).toString();
            break;
          case 'pending':
            result = loc.formatString(loc.transactionDetails.description.send.pending, args).toString();
            break;
          case 'failed':
            result = loc.formatString(loc.transactionDetails.description.send.failed, args).toString();
            break;
        }
      }

      return result;
    }

    case TRANSACTION_PENDING_TYPES.RECEIVE:
    case TRANSACTION_TYPES.RECEIVE: {
      let result = '';

      if (config.isUtxo) {
        const args = {
          amount: `${config.assetAmount} ${config.assetSymbol}`,
        };

        
        
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.receiveUtxo.succeeded, args).toString();
            break;
          case 'pending':
            result = loc.formatString(loc.transactionDetails.description.receiveUtxo.pending, args).toString();
            break;
        }
      } else {
        const args = {
          amount: `${config.assetAmount} ${config.assetSymbol}`,
          address: formatAddress(config.address ?? '', true),
        };

        
        
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.receive.succeeded, args).toString();
            break;
          case 'pending':
            result = loc.formatString(loc.transactionDetails.description.receive.pending, args).toString();
            break;
        }
      }

      return result;
    }

    case TRANSACTION_TYPES.SWAP: {
      const args = {
        amountSent: `${config.assetAmount} ${config.assetSymbol}`,
        amountReceived: `${config.assetAmountReceived} ${config.assetSymbolReceived}`,
        address: formatAddress(config.address ?? '', true),
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.swap.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.swap.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.swap.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.TOKEN_APPROVAL:
    case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
      const args = {
        amount: `${config.assetAmount} ${config.assetSymbol}`,
        address: formatAddress(config.address ?? '', true),
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.approval.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.approval.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.approval.failed, args).toString();
          break;
      }

      return result;
    }

    case TRANSACTION_TYPES.CONTRACT_INTERACTION: {
      const args = {
        address: formatAddress(config.address ?? '', true),
      };

      let result = '';

      if (config.transactionTitle === loc.transactionTile.type.contractInteractionAffected) {
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.contractInteractionFundsReceived.succeeded, args).toString();
            break;
        }
      } else {
        
        
        switch (config.transactionState) {
          case 'succeeded':
            result = loc.formatString(loc.transactionDetails.description.contractInteraction.succeeded, args).toString();
            break;
          case 'pending':
            result = loc.formatString(loc.transactionDetails.description.contractInteraction.pending, args).toString();
            break;
          case 'failed':
            result = loc.formatString(loc.transactionDetails.description.contractInteraction.failed, args).toString();
            break;
        }
      }

      return result;
    }

    case TRANSACTION_TYPES.DEPOSIT: {
      const args = {
        amount: `${config.assetAmount} ${config.assetSymbol}`,
        address: formatAddress(config.address ?? '', true),
      };

      let result = '';

      
      
      switch (config.transactionState) {
        case 'succeeded':
          result = loc.formatString(loc.transactionDetails.description.deposit.succeeded, args).toString();
          break;
        case 'pending':
          result = loc.formatString(loc.transactionDetails.description.deposit.pending, args).toString();
          break;
        case 'failed':
          result = loc.formatString(loc.transactionDetails.description.deposit.failed, args).toString();
          break;
      }

      return result;
    }

    default: {
      return loc.transactionDetails.notes_empty;
    }
  }
};
