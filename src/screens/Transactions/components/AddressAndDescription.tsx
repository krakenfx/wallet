import React from 'react';

import NameResolver from '@/api/NameResolver';
import { AddressDisplay } from '@/components/AddressDisplay';
import { Button } from '@/components/Button';
import { CopyToClipBoard } from '@/components/CopyToClipboard';
import { Label } from '@/components/Label';
import { LabeledField } from '@/components/LabeledField';

import { useAppCurrency } from '@/realm/settings';
import { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';
import { NavigationProps, Routes } from '@/Routes';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { useTransactionContext } from '../context/TransactionContext';
import { getAddressesFromParsedTransaction } from '../utils/getAddressesFromParsedTransaction';
import { getDefaultTransactionNotes } from '../utils/getDefaultTransactionNotes';

import { isBtcOrDoge } from '../utils/isBtcOrDoge';

import loc from '/loc';

export const AddressesAndDescription: React.FC<Pick<NavigationProps<'TransactionDetails'>, 'navigation'>> = ({ navigation }) => {
  const { transactionWalletAddress, transaction, parsedTransaction, transactionDetailsMetadata } = useTransactionContext();
  const { currency } = useAppCurrency();

  const onOpenEditNote = (defaultNotes: string) => () => {
    navigation.navigate(Routes.EditNote, {
      walletId: transaction.walletId,
      transactionId: transaction.transactionId,
      defaultNotes,
    });
  };

  switch (transactionDetailsMetadata.transactionType) {
    
    case TRANSACTION_TYPES.NFT_BUY:
    case TRANSACTION_TYPES.NFT_SELL:
    case TRANSACTION_TYPES.NFT_MINT: {
      if (!parsedTransaction) {
        return null;
      }

      const { target } = getAddressesFromParsedTransaction(parsedTransaction);
      const defaultNotes = getDefaultTransactionNotes({
        address: target,
        nftName: transactionDetailsMetadata.nftMetadata?.name ?? '',
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.contractAddress} address={target} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }
    case TRANSACTION_TYPES.NFT_SEND:
    case TRANSACTION_TYPES.NFT_RECEIVE: {
      if (!parsedTransaction) {
        return null;
      }

      const { recipient, target } = getAddressesFromParsedTransaction(parsedTransaction);
      const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_TYPES.NFT_RECEIVE;
      const [from, to] = isReceive ? [target, transactionWalletAddress] : [transactionWalletAddress, recipient];
      const defaultNotes = getDefaultTransactionNotes({
        address: isReceive ? from : to,
        nftName: transactionDetailsMetadata.nftMetadata?.name ?? '',
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.from} address={from} />
          <LabeledAddress label={loc.transactionDetails.to} address={to} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    
    
    case TRANSACTION_PENDING_TYPES.SEND:
    case TRANSACTION_PENDING_TYPES.RECEIVE: {
      if (!transaction?.isValid()) {
        return null;
      }

      const isBtcOrDoge_ = isBtcOrDoge(transaction.wallet.type);
      const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_PENDING_TYPES.RECEIVE;
      const { from, to } = transactionDetailsMetadata.pendingMetadata ?? {};
      const defaultNotes = getDefaultTransactionNotes({
        address: isReceive ? from : to,
        assetAmount: transactionDetailsMetadata.isNft
          ? transactionDetailsMetadata.tokenAmount
          : formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
              currency,
              highPrecision: true,
              isBtc: isBtc({ walletType: transaction.wallet.type }),
            }),
        assetSymbol: transactionDetailsMetadata.symbol,
        isUtxo: isBtcOrDoge_,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: 'pending',
      });

      return (
        <>
          {!isBtcOrDoge_ && <LabeledAddress label={loc.transactionDetails.from} address={from} />}
          <LabeledAddress label={loc.transactionDetails.to} address={to} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    
    case TRANSACTION_TYPES.SEND:
    case TRANSACTION_TYPES.RECEIVE: {
      if (!parsedTransaction) {
        return null;
      }

      const { sender, recipient } = getAddressesFromParsedTransaction(parsedTransaction);
      const isBtcOrDoge_ = isBtcOrDoge(transaction.wallet.type);
      const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_TYPES.RECEIVE;
      const [from, to] = isReceive ? [sender, transactionWalletAddress] : [transactionWalletAddress, recipient];
      const defaultNotes = getDefaultTransactionNotes({
        address: isReceive ? from : to,
        assetAmount: formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
          currency,
          highPrecision: true,
          isBtc: isBtc({ walletType: transaction.wallet.type }),
        }),
        assetSymbol: transactionDetailsMetadata.symbol,
        isUtxo: isBtcOrDoge_,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          {!isBtcOrDoge_ && <LabeledAddress label={loc.transactionDetails.from} address={from} />}
          <LabeledAddress label={loc.transactionDetails.to} address={to} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    case TRANSACTION_TYPES.SWAP: {
      const effect = parsedTransaction?.effects?.[0];
      if (effect?.type !== 'swap' || !parsedTransaction) {
        return null;
      }

      const { target } = getAddressesFromParsedTransaction(parsedTransaction);
      const { spent, receive: receive_ } = effect;
      const { sent, receive } = transactionDetailsMetadata.swapMetadata!;
      const formatAssetAmount = (assetAmount: string, assetId: string, decimals: number) => {
        const assetAmountInTokenUnit = smallUnit2TokenUnit(assetAmount, decimals);
        const assetAmountFormatted = formatTokenAmount(assetAmountInTokenUnit.absoluteValue().toString(10), {
          currency,
          highPrecision: true,
          isBtc: isBtc({ assetId }),
        });

        return assetAmountFormatted;
      };
      const defaultNotes = getDefaultTransactionNotes({
        address: spent.recipient, 
        assetAmount: '-' + formatAssetAmount(spent.amount, sent.assetId, sent.decimals),
        assetSymbol: sent.symbol,
        assetAmountReceived: formatAssetAmount(receive_.amount, receive.assetId, receive.decimals),
        assetSymbolReceived: receive.symbol,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.contractAddress} address={target} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    case TRANSACTION_TYPES.TOKEN_APPROVAL:
    case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
      if (!parsedTransaction) {
        return null;
      }

      const { target } = getAddressesFromParsedTransaction(parsedTransaction);
      const defaultNotes = getDefaultTransactionNotes({
        address: target,
        assetAmount: formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
          currency,
          highPrecision: true,
          isBtc: isBtc({ walletType: transaction.wallet.type }),
        }),
        assetSymbol: transactionDetailsMetadata.symbol,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.contractAddress} address={target} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    case TRANSACTION_TYPES.CONTRACT_INTERACTION: {
      if (!parsedTransaction) {
        return null;
      }

      const { target } = getAddressesFromParsedTransaction(parsedTransaction);
      const defaultNotes = getDefaultTransactionNotes({
        address: target,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
        
        
        
        
        
        
        
        transactionTitle: transactionDetailsMetadata.title,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.contractAddress} address={target} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    case TRANSACTION_TYPES.DEPOSIT: {
      if (!parsedTransaction) {
        return null;
      }

      const { target } = getAddressesFromParsedTransaction(parsedTransaction);
      const defaultNotes = getDefaultTransactionNotes({
        address: target,
        assetAmount: formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
          currency,
          highPrecision: true,
          isBtc: isBtc({ walletType: transaction.wallet.type }),
        }),
        assetSymbol: transactionDetailsMetadata.symbol,
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: parsedTransaction.status,
      });

      return (
        <>
          <LabeledAddress label={loc.transactionDetails.contractAddress} address={target} />
          <LabeledField
            label={loc.transactionDetails.notes}
            right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
            <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
          </LabeledField>
        </>
      );
    }

    
    
    default: {
      const defaultNotes = getDefaultTransactionNotes({
        transactionType: transactionDetailsMetadata.transactionType,
        transactionState: 'succeeded',
      });

      return (
        <LabeledField
          label={loc.transactionDetails.notes}
          right={<Button onPress={onOpenEditNote(defaultNotes)} text={loc.transactionDetails.notes_edit} testID="TxDetailsEditButton" />}>
          <Label testID="TxDetailsDescription">{transaction.notes?.value ?? defaultNotes}</Label>
        </LabeledField>
      );
    }
  }
};

interface LabeledAddressProps {
  label: string;
  address?: string;
}


const LabeledAddress: React.FC<LabeledAddressProps> = ({ label, address }) => {
  if (!address) {
    return null;
  }

  return (
    <LabeledField label={label}>
      <CopyToClipBoard stringToCopy={address}>
        <AddressDisplayHandleEnsName address={address} />
      </CopyToClipBoard>
    </LabeledField>
  );
};

interface AddressDisplayHandleEnsNameProps {
  address: string;
}

const AddressDisplayHandleEnsName: React.FC<AddressDisplayHandleEnsNameProps> = ({ address }) => {
  if (NameResolver.isEnsName(address)) {
    return <AddressDisplay address={address} ensName={address} showEnsNameOnly />;
  }

  return <AddressDisplay address={address} hasSpaces boldPrefix />;
};
