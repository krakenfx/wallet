import format from 'date-fns/format';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AnimateStyle } from 'react-native-reanimated';

import NameResolver from '@/api/NameResolver';
import { Transaction } from '@/api/types';
import { AddressDisplay } from '@/components/AddressDisplay';
import { Button } from '@/components/Button';
import { CopyToClipBoard } from '@/components/CopyToClipboard';
import { DoubleRow } from '@/components/DoubleRow';
import { Label } from '@/components/Label';
import { LabeledField } from '@/components/LabeledField';
import navigationStyle from '@/components/navigationStyle';
import { ExpandableSheet } from '@/components/Sheets';
import { TransactionAmount, TransactionAmountWithAppCurrency, TransactionHeader, TransactionNftPreview, TransactionPath } from '@/components/Transaction';
import { BTCTransaction } from '@/onChain/wallets/bitcoin';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { AssetMetadata } from '@/realm/assetMetadata';
import { NftMetadata } from '@/realm/nftMetadata';
import { useAppCurrency } from '@/realm/settings';
import { usePendingTransactionById, useTransactionById } from '@/realm/transactions';
import { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';
import { memoizedJSONParseTx } from '@/realm/transactions/utils';
import { NavigationProps, Routes } from '@/Routes';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { TransactionDetailsNetworkFee } from './components/TransactionDetailsNetworkFee';
import { TransactionDetailsShowMoreContentNetworkFee } from './components/TransactionDetailsShowMoreContentNetworkFee';
import { getAddressesFromParsedTransaction } from './utils/getAddressesFromParsedTransaction';
import { getDefaultTransactionNotes } from './utils/getDefaultTransactionNotes';
import { getHeaderNameFromParsedTransaction } from './utils/getHeaderNameFromParsedTransaction';
import { openExplorer } from './utils/openExplorer';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TransactionDetailsType = {
  title: string;
  description: string;
  networkFee?: string | null;
  appCurrencyValue: string;
  tokenAmount: string;
  symbol?: string;
  transactionType?: TRANSACTION_TYPES | TRANSACTION_PENDING_TYPES;
  swapMetadata?: { sent: AssetMetadata; receive: AssetMetadata };
  isNft?: boolean;
  nftMetadata?: NftMetadata;
  pendingMetadata?: {
    to: string;
    from: string;
  };
};

export type TransactionDetailsParams = {
  id: string;
  assetId?: string;
  transactionDetailsData: TransactionDetailsType;
};

const isBtcOrDoge = (walletType: string) => walletType === 'HDsegwitBech32' || walletType === 'dogecoin';

const formatTransactionTime = (transactionTime: number | null) =>
  transactionTime === null ? undefined : format(new Date(transactionTime * 1000), 'd LLLL yyyy・h:mmaaa');

const AddressDisplayHandleEnsName = ({ address }: { address: string }) => {
  if (NameResolver.isEnsName(address)) {
    return <AddressDisplay address={address} ensName={address} showEnsNameOnly />;
  } else {
    return <AddressDisplay address={address} hasSpaces boldPrefix />;
  }
};

const LabeledAddress = ({ label, address }: { label: string; address?: string }) => {
  return address ? (
    <LabeledField label={label}>
      <CopyToClipBoard stringToCopy={address}>
        <AddressDisplayHandleEnsName address={address} />
      </CopyToClipBoard>
    </LabeledField>
  ) : null;
};

export const TransactionDetailsScreen = ({ route, navigation }: NavigationProps<'TransactionDetails'>) => {
  const { params } = route;
  const { currency } = useAppCurrency();
  const existingTransaction = useTransactionById(route.params.id);
  const pendingTransaction = usePendingTransactionById(route.params.id);
  const transaction = existingTransaction || pendingTransaction;
  const transactionDetailsMetadata = route.params.transactionDetailsData;

  const onOpenExplorer = useCallback(() => {
    openExplorer(transaction.wallet.type, transaction.transactionId);
  }, [transaction.transactionId, transaction.wallet.type]);
  const onOpenEditNote = useCallback(
    (defaultNotes: string) => () => {
      navigation.navigate(Routes.EditNote, {
        walletId: transaction.walletId,
        transactionId: transaction.transactionId,
        defaultNotes,
      });
    },
    [navigation, transaction],
  );
  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const { network } = getImplForWallet(transaction.wallet);

  const getTransactionWalletAddress = useCallback(async (): Promise<string> => {
    const nameResolver = new NameResolver(network);
    const transactionWalletAddress = await network.deriveAddress(transaction.wallet);

    if (!nameResolver.isNetworkSupported()) {
      return transactionWalletAddress;
    }
    try {
      return (await nameResolver.resolveAddress(transactionWalletAddress)) || transactionWalletAddress;
    } catch {
      return transactionWalletAddress;
    }
  }, [network, transaction.wallet]);
  const [transactionWalletAddress, setTransactionWalletAddress] = useState('');

  useEffect(() => {
    (async () => {
      const txWalletAddress = await getTransactionWalletAddress();
      setTransactionWalletAddress(txWalletAddress);
    })();
  }, [getTransactionWalletAddress]);

  const parsedTransaction: Transaction | BTCTransaction | undefined = useMemo(() => {
    try {
      if ('data' in transaction) {
        return memoizedJSONParseTx(transaction.data ?? '{}');
      } else {
        return undefined;
      }
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      return undefined;
    }
  }, [transaction]);

  const renderStickyHeader = useCallback(
    ({ collapsibleSectionStyle }: { collapsibleSectionStyle: StyleProp<AnimateStyle<StyleProp<ViewStyle>>> }) => {
      let header = null;
      const badge = parsedTransaction && 'status' in parsedTransaction && parsedTransaction.status === 'failed' ? 'failed' : undefined;

      switch (transactionDetailsMetadata.transactionType) {
        case TRANSACTION_TYPES.NFT_BUY:
        case TRANSACTION_TYPES.NFT_MINT:
        case TRANSACTION_TYPES.NFT_SELL: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }
        case TRANSACTION_TYPES.NFT_SEND:
        case TRANSACTION_TYPES.NFT_RECEIVE: {
          header = <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
          break;
        }

        case TRANSACTION_PENDING_TYPES.SEND:
        case TRANSACTION_PENDING_TYPES.RECEIVE: {
          header = (
            <TransactionHeader
              heading={transactionDetailsMetadata.title}
              date={
                pendingTransaction?.isValid() && pendingTransaction.time !== null
                  ? format(new Date(pendingTransaction.time * 1000), 'd LLLL yyyy・h:mmaaa')
                  : undefined
              }
              badge={badge ?? (pendingTransaction?.isValid() && pendingTransaction) ? 'pending' : undefined}
            />
          );
          break;
        }

        case TRANSACTION_TYPES.SEND:
        case TRANSACTION_TYPES.RECEIVE: {
          header = <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
          break;
        }

        case TRANSACTION_TYPES.SWAP: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }

        case TRANSACTION_TYPES.TOKEN_APPROVAL: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }

        case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }

        case TRANSACTION_TYPES.CONTRACT_INTERACTION: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }

        case TRANSACTION_TYPES.DEPOSIT: {
          header = (
            <TransactionHeader
              collapsibleSectionStyle={collapsibleSectionStyle}
              useFallbackIcon
              name={getHeaderNameFromParsedTransaction(parsedTransaction)}
              heading={transactionDetailsMetadata.title}
              date={formatTransactionTime(transaction.time)}
              badge={badge}
            />
          );
          break;
        }

        default: {
          header = <TransactionHeader heading={transactionDetailsMetadata.title} date={formatTransactionTime(transaction.time)} badge={badge} />;
        }
      }

      return <View style={styles.stickyHeaderContainer}>{header}</View>;
    },
    [parsedTransaction, pendingTransaction, transaction.time, transactionDetailsMetadata],
  );

  const renderTransactionDetails = useCallback(() => {
    switch (transactionDetailsMetadata.transactionType) {
      case TRANSACTION_TYPES.NFT_BUY:
      case TRANSACTION_TYPES.NFT_MINT:
      case TRANSACTION_TYPES.NFT_SELL: {
        const isMint = transactionDetailsMetadata.transactionType === TRANSACTION_TYPES.NFT_MINT;
        const isEmpty = transactionDetailsMetadata.tokenAmount === '0' || transactionDetailsMetadata.tokenAmount === '';
        const label = isMint && isEmpty ? loc.transactionDetails.free : undefined;

        return (
          <>
            <TransactionNftPreview nft={{ metadata: transactionDetailsMetadata.nftMetadata! }} />
            <TransactionAmount
              tokenIconProps={{ wallet: transaction.wallet, tokenId: params.assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
              assetAmount={transactionDetailsMetadata.tokenAmount}
              assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
              assetNetwork={transaction.wallet.type}
              assetSymbol={transactionDetailsMetadata.symbol}
              attached
              label={label}
            />
            <TransactionDetailsNetworkFee
              networkName={transaction.wallet.type}
              assetId={network.nativeTokenCaipId}
              nativeTokenDecimals={network.nativeTokenDecimals}
              nativeTokenSymbol={network.nativeTokenSymbol}
              networkFee={transactionDetailsMetadata.networkFee}
            />
          </>
        );
      }
      case TRANSACTION_TYPES.NFT_SEND:
      case TRANSACTION_TYPES.NFT_RECEIVE: {
        const { recipient, target } = getAddressesFromParsedTransaction(parsedTransaction);
        const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_TYPES.NFT_RECEIVE;
        const [from, to] = isReceive ? [target, transactionWalletAddress] : [transactionWalletAddress, recipient];

        return (
          <>
            <TransactionNftPreview nft={{ metadata: transactionDetailsMetadata.nftMetadata! }} />
            {!isReceive && (
              <TransactionDetailsNetworkFee
                networkName={transaction.wallet.type}
                assetId={network.nativeTokenCaipId}
                nativeTokenDecimals={network.nativeTokenDecimals}
                nativeTokenSymbol={network.nativeTokenSymbol}
                networkFee={transactionDetailsMetadata.networkFee}
                detached
              />
            )}
            <TransactionPath from={from} to={to} />
          </>
        );
      }

      case TRANSACTION_PENDING_TYPES.SEND:
      case TRANSACTION_PENDING_TYPES.RECEIVE: {
        if (transaction?.isValid()) {
          const isBtcOrDoge_ = isBtcOrDoge(transaction.wallet.type);
          const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_PENDING_TYPES.RECEIVE;
          const { from, to } = transactionDetailsMetadata.pendingMetadata ?? {};

          return (
            <>
              {!transactionDetailsMetadata.isNft && (
                <TransactionAmount
                  tokenIconProps={{
                    wallet: transaction.wallet,
                    tokenId: params.assetId,
                    tokenSymbol: transactionDetailsMetadata.symbol,
                  }}
                  assetAmount={formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
                    compact: true,
                    currency,
                  })}
                  assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
                  assetNetwork={transaction.wallet.type}
                  assetSymbol={transactionDetailsMetadata.symbol}
                  attached={!isReceive}
                />
              )}
              {!isReceive && (
                <TransactionDetailsNetworkFee
                  networkName={transaction.wallet.type}
                  assetId={network.nativeTokenCaipId}
                  nativeTokenDecimals={network.nativeTokenDecimals}
                  nativeTokenSymbol={network.nativeTokenSymbol}
                  networkFee={transactionDetailsMetadata.networkFee}
                  detached={transactionDetailsMetadata.isNft}
                />
              )}
              {}
              {isBtcOrDoge_ && isReceive ? null : <TransactionPath from={from} to={to} />}
            </>
          );
        } else {
          return null;
        }
      }

      case TRANSACTION_TYPES.SEND:
      case TRANSACTION_TYPES.RECEIVE: {
        const { sender, recipient } = getAddressesFromParsedTransaction(parsedTransaction);
        const isBtcOrDoge_ = isBtcOrDoge(transaction.wallet.type);
        const isReceive = transactionDetailsMetadata.transactionType === TRANSACTION_TYPES.RECEIVE;
        const [from, to] = isReceive ? [sender, transactionWalletAddress] : [transactionWalletAddress, recipient];

        return (
          <>
            <TransactionAmount
              tokenIconProps={{ wallet: transaction.wallet, tokenId: params.assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
              assetAmount={formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
                compact: true,
                currency,
              })}
              assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
              assetNetwork={transaction.wallet.type}
              assetSymbol={transactionDetailsMetadata.symbol}
              testID="TxDetails"
              attached={!isReceive}
            />
            {!isReceive && (
              <TransactionDetailsNetworkFee
                networkName={transaction.wallet.type}
                assetId={network.nativeTokenCaipId}
                nativeTokenDecimals={network.nativeTokenDecimals}
                nativeTokenSymbol={network.nativeTokenSymbol}
                networkFee={transactionDetailsMetadata.networkFee}
              />
            )}
            {}
            {isBtcOrDoge_ && isReceive ? null : <TransactionPath from={from} to={to} testID="TxPath" />}
          </>
        );
      }

      case TRANSACTION_TYPES.SWAP: {
        const effect = parsedTransaction?.effects?.[0];
        if (effect?.type !== 'swap') {
          return null;
        }

        const { sent, receive } = transactionDetailsMetadata.swapMetadata!;
        const { spent, receive: receive_ } = effect;

        const formatAssetAmount = (assetAmount: string, assetId: string, decimals: number) => {
          const assetAmountInTokenUnit = smallUnit2TokenUnit(assetAmount, decimals);
          const assetAmountFormatted = formatTokenAmount(assetAmountInTokenUnit.absoluteValue().toString(10), {
            compact: true,
            currency,
          });

          return assetAmountFormatted;
        };

        return (
          <>
            <DoubleRow
              iconName="swap"
              renderTop={({ containerStyle }) => (
                <TransactionAmountWithAppCurrency
                  assetId={sent.assetId}
                  decimals={sent.decimals}
                  balance={spent.amount}
                  tokenIconProps={{ wallet: transaction.wallet, tokenId: sent.assetId, tokenSymbol: sent.symbol }}
                  assetAmount={'-' + formatAssetAmount(spent.amount, sent.assetId, sent.decimals)}
                  assetNetwork={transaction.wallet.type}
                  assetSymbol={sent.symbol}
                  containerStyle={containerStyle}
                />
              )}
              renderBottom={({ containerStyle }) => (
                <TransactionAmountWithAppCurrency
                  assetId={receive.assetId}
                  decimals={receive.decimals}
                  balance={receive_.amount}
                  tokenIconProps={{ wallet: transaction.wallet, tokenId: receive.assetId, tokenSymbol: receive.symbol }}
                  assetAmount={formatAssetAmount(receive_.amount, receive.assetId, receive.decimals)}
                  assetNetwork={transaction.wallet.type}
                  assetSymbol={receive.symbol}
                  containerStyle={containerStyle}
                  attached
                />
              )}
            />
            <TransactionDetailsNetworkFee
              networkName={transaction.wallet.type}
              assetId={network.nativeTokenCaipId}
              nativeTokenDecimals={network.nativeTokenDecimals}
              nativeTokenSymbol={network.nativeTokenSymbol}
              networkFee={transactionDetailsMetadata.networkFee}
            />
          </>
        );
      }

      case TRANSACTION_TYPES.TOKEN_APPROVAL: {
        return (
          <>
            <TransactionAmount
              tokenIconProps={{ wallet: transaction.wallet, tokenId: params.assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
              assetAmount={formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
                compact: true,
                currency,
              })}
              assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
              assetNetwork={transaction.wallet.type}
              assetSymbol={transactionDetailsMetadata.symbol}
              attached
            />
            <TransactionDetailsNetworkFee
              networkName={transaction.wallet.type}
              assetId={network.nativeTokenCaipId}
              nativeTokenDecimals={network.nativeTokenDecimals}
              nativeTokenSymbol={network.nativeTokenSymbol}
              networkFee={transactionDetailsMetadata.networkFee}
            />
          </>
        );
      }

      case TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED: {
        return (
          <>
            <TransactionAmount
              tokenIconProps={{ wallet: transaction.wallet, tokenId: params.assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
              assetAmount={formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
                compact: true,
                currency,
              })}
              assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
              assetNetwork={transaction.wallet.type}
              assetSymbol={transactionDetailsMetadata.symbol}
              attached
              label={loc.transactionDetails.unlimited}
            />
            <TransactionDetailsNetworkFee
              networkName={transaction.wallet.type}
              assetId={network.nativeTokenCaipId}
              nativeTokenDecimals={network.nativeTokenDecimals}
              nativeTokenSymbol={network.nativeTokenSymbol}
              networkFee={transactionDetailsMetadata.networkFee}
            />
          </>
        );
      }

      case TRANSACTION_TYPES.DEPOSIT: {
        return (
          <>
            <TransactionAmount
              tokenIconProps={{ wallet: transaction.wallet, tokenId: params.assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
              assetAmount={formatTokenAmount(transactionDetailsMetadata.tokenAmount, {
                compact: true,
                currency,
              })}
              assetFiatAmount={transactionDetailsMetadata.appCurrencyValue}
              assetNetwork={transaction.wallet.type}
              assetSymbol={transactionDetailsMetadata.symbol}
            />
            <TransactionDetailsNetworkFee
              networkName={transaction.wallet.type}
              assetId={network.nativeTokenCaipId}
              nativeTokenDecimals={network.nativeTokenDecimals}
              nativeTokenSymbol={network.nativeTokenSymbol}
              networkFee={transactionDetailsMetadata.networkFee}
            />
          </>
        );
      }

      case TRANSACTION_TYPES.CONTRACT_INTERACTION: {
        return (
          <TransactionDetailsNetworkFee
            networkName={transaction.wallet.type}
            assetId={network.nativeTokenCaipId}
            nativeTokenDecimals={network.nativeTokenDecimals}
            nativeTokenSymbol={network.nativeTokenSymbol}
            networkFee={transactionDetailsMetadata.networkFee}
            detached
          />
        );
      }

      default: {
        return null;
      }
    }
  }, [
    currency,
    transaction,
    transactionWalletAddress,
    params.assetId,
    parsedTransaction,
    transactionDetailsMetadata,
    network.nativeTokenCaipId,
    network.nativeTokenSymbol,
    network.nativeTokenDecimals,
  ]);

  const renderShowMoreContent = useCallback(() => {
    const renderAddressesAndDescription = () => {
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

    return (
      <ScrollView>
        <View style={styles.wrapper}>
          {!!pendingTransaction?.isValid() && !existingTransaction && (
            <LabeledField label={loc.transactionDetails.status}>
              <Label testID="TxDetailsStatus">{loc.transactionDetails.state.pending}</Label>
            </LabeledField>
          )}
          {transaction.time && (
            <LabeledField label={loc.transactionDetails.time}>
              {}
              <Label testID="TxDetailsTime">{format(new Date(transaction.time * 1000), "d LLLL yyyy 'at' h:mm aa")}</Label>
            </LabeledField>
          )}

          {renderAddressesAndDescription()}

          <LabeledField label={loc.transactionDetails.transaction_id}>
            <CopyToClipBoard stringToCopy={transaction.transactionId}>
              <Label testID="TxDetailsId">{transaction.transactionId}</Label>
            </CopyToClipBoard>
          </LabeledField>

          <TransactionDetailsShowMoreContentNetworkFee
            assetId={network.nativeTokenCaipId}
            nativeTokenDecimals={network.nativeTokenDecimals}
            nativeTokenSymbol={network.nativeTokenSymbol}
            networkFee={transactionDetailsMetadata.networkFee}
          />
          {parsedTransaction && 'inputs' in parsedTransaction && (parsedTransaction.inputs as string[]).length && (
            <LabeledField label={loc.transactionDetails.inputs}>
              {(parsedTransaction.inputs as string[]).map((inputAddress: string, i: number) => (
                <CopyToClipBoard stringToCopy={inputAddress} key={inputAddress + '_input_' + i}>
                  <AddressDisplay address={inputAddress} hasSpaces boldPrefix />
                </CopyToClipBoard>
              ))}
            </LabeledField>
          )}
          {parsedTransaction && 'outputs' in parsedTransaction && (parsedTransaction.outputs as string[]).length && (
            <LabeledField label={loc.transactionDetails.outputs}>
              {(parsedTransaction.outputs as string[]).map((outputAddress: string, i: number) => (
                <CopyToClipBoard stringToCopy={outputAddress} key={outputAddress + '_output_' + i}>
                  <AddressDisplay address={outputAddress} hasSpaces boldPrefix style={i > 0 && styles.inputsOutputs} />
                </CopyToClipBoard>
              ))}
            </LabeledField>
          )}
        </View>
      </ScrollView>
    );
  }, [
    currency,
    pendingTransaction,
    existingTransaction,
    transaction,
    network.nativeTokenCaipId,
    network.nativeTokenDecimals,
    network.nativeTokenSymbol,
    transactionDetailsMetadata.isNft,
    transactionDetailsMetadata.networkFee,
    transactionDetailsMetadata.transactionType,
    transactionDetailsMetadata.nftMetadata?.name,
    transactionDetailsMetadata.pendingMetadata,
    transactionDetailsMetadata.tokenAmount,
    transactionDetailsMetadata.symbol,
    transactionDetailsMetadata.swapMetadata,
    transactionDetailsMetadata.title,
    parsedTransaction,
    onOpenEditNote,
    transactionWalletAddress,
  ]);

  const renderFooter = useCallback(() => {
    const primaryButton = {
      text: loc.transactionDetails.openExplorer,
      testID: 'TxDetailsViewInExplorerButton',
      onPress: () => onOpenExplorer(),
    };

    return <Button size="large" {...primaryButton} color="kraken" style={styles.bottomButton} />;
  }, [onOpenExplorer]);

  return !transaction.isValid() ? null : (
    <ExpandableSheet
      dismissible
      onDismiss={navigateBack}
      StickyHeaderComponent={renderStickyHeader}
      PreviewComponent={renderTransactionDetails}
      DetailsComponent={renderShowMoreContent}
      FloatingButtonsComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginHorizontal: 24,
    paddingBottom: 150,
  },
  bottomButton: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  stickyHeaderContainer: {
    paddingTop: 10,
  },
  inputsOutputs: {
    paddingTop: 4,
  },
});

TransactionDetailsScreen.navigationOptions = navigationStyle({
  headerShown: false,
  animation: 'none',
  presentation: 'transparentModal',
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
