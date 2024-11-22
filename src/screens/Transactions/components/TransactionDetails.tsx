import type React from 'react';

import { DoubleRow } from '@/components/DoubleRow';
import { TransactionAmount, TransactionAmountWithAppCurrency, TransactionNftPreview, TransactionPath } from '@/components/Transaction';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings';
import { TRANSACTION_PENDING_TYPES, TRANSACTION_TYPES } from '@/realm/transactions/const';

import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { useTransactionContext } from '../context/TransactionContext';
import { getAddressesFromParsedTransaction } from '../utils/getAddressesFromParsedTransaction';

import { isBtcOrDoge } from '../utils/isBtcOrDoge';

import { TransactionDetailsNetworkFee } from './TransactionDetailsNetworkFee';

import loc from '/loc';

interface TransactionDetailsProps {
  assetId: string | undefined;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ assetId }) => {
  const { transaction, parsedTransaction, transactionWalletAddress, transactionDetailsMetadata } = useTransactionContext();
  const { currency } = useAppCurrency();
  const { network } = getImplForWallet(transaction.wallet);

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
            tokenIconProps={{ wallet: transaction.wallet, tokenId: assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
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
                  tokenId: assetId,
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
      }
      return null;
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
            tokenIconProps={{ wallet: transaction.wallet, tokenId: assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
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
            tokenIconProps={{ wallet: transaction.wallet, tokenId: assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
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
            tokenIconProps={{ wallet: transaction.wallet, tokenId: assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
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
            tokenIconProps={{ wallet: transaction.wallet, tokenId: assetId, tokenSymbol: transactionDetailsMetadata.symbol }}
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
};
