import type { ReactElement } from 'react';

import BigNumber from 'bignumber.js';
import React from 'react';
import { StyleSheet } from 'react-native';

import type { Transaction } from '@/api/types';
import { SvgIcon } from '@/components/SvgIcon';
import { SwapIcon } from '@/components/SwapIcon';
import { SwapIconHorizontal } from '@/components/SwapIconHorizontal';
import { ContractInteraction, TokenIcon } from '@/components/TokenIcon';
import type { WalletType } from '@/onChain/wallets/registry';
import type { AssetMetadata } from '@/realm/assetMetadata';
import type { RealmToken } from '@/realm/tokens';
import type { RealmTransaction } from '@/realm/transactions';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { TransactionData } from '@/realm/transactions/getTransactionMetadata';
import { getTransactionTitle } from '@/realm/transactions/getTransactionMetadata';
import type { RealmWallet } from '@/realm/wallets';
import { unitConverter } from '@/utils/unitConverter';

import { formatTransactionAddress } from '../formatAddress';

import loc from '/loc';

const IMG_SIZE = 40;
const DESC_ICON_SIZE = 16;

export type GetTransactionDisplayDataProps = {
  parsedTx: Transaction;
  classifiedTx: TransactionData;
  contextToken?: RealmToken;
  item: RealmTransaction;
  testID?: string;
  txMetadata?: AssetMetadata;
  txSwapSentMetadata?: AssetMetadata;
  txSwapReceiveMetadata?: AssetMetadata;
  wallet: RealmWallet;
};

export const getTransactionDisplayData = ({
  classifiedTx,
  contextToken,
  item,
  parsedTx,
  testID,
  txMetadata,
  txSwapReceiveMetadata,
  txSwapSentMetadata,
  wallet,
}: GetTransactionDisplayDataProps) => {
  let description: string | undefined;
  let descriptionIcon: ReactElement | undefined;
  let displayAssetMetadata: AssetMetadata | undefined;
  let displayAssetAmount: string | undefined;
  let detailsAssetAmount: string | undefined;
  let detailsAssetId: string | undefined;
  let displayAssetId: string | undefined;
  let icon;
  let title: string = '';
  let isSwapSent = false;
  let isNetworkFee = false;

  const isGlobalView = !contextToken;
  const isNativeAsset = isGlobalView ? false : contextToken.assetId === wallet.nativeTokenCaipId;

  switch (classifiedTx.kind) {
    case 'swap': {
      
      icon = <SwapIcon sentAsset={txSwapSentMetadata} receivedAsset={txSwapReceiveMetadata} testID={`Icon-${testID}`} />;

      
      if (isGlobalView) {
        displayAssetMetadata = txSwapReceiveMetadata;
        displayAssetId = classifiedTx.receive.assetId;
        displayAssetAmount = classifiedTx.receive.amount;
      }

      
      else if (contextToken?.assetId === classifiedTx.sent.assetId) {
        isSwapSent = true;
        displayAssetMetadata = txSwapSentMetadata;
        displayAssetId = classifiedTx.sent.assetId;
        displayAssetAmount = classifiedTx.sent.amount;
      }

      
      else if (contextToken?.assetId === classifiedTx.receive.assetId) {
        displayAssetMetadata = txSwapReceiveMetadata;
        displayAssetId = classifiedTx.receive.assetId;
        displayAssetAmount = classifiedTx.receive.amount;
      }

      
      
      
      else {
        isNetworkFee = true;
        displayAssetMetadata = contextToken.metadata;
        displayAssetId = contextToken?.assetId;
        displayAssetAmount = BigNumber(item.fee ?? '')
          .negated()
          .toString(10);
        icon = <SvgIcon name="gas-fee" style={styles.icon} gradientIconBackground />;
        descriptionIcon = (
          <SwapIconHorizontal
            sentAssetSymbol={txSwapSentMetadata?.symbol ?? '???'}
            receivedAssetSymbol={txSwapReceiveMetadata?.symbol ?? '???'}
            testID={`Icon-${testID}`}
          />
        );
        description = loc.transactionTile.type.swap;
      }
      break;
    }
    case 'simple': {
      
      const shouldShowNetworkFee =
        (classifiedTx.type === TRANSACTION_TYPES.TOKEN_APPROVAL ||
          classifiedTx.type === TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED ||
          classifiedTx.type === TRANSACTION_TYPES.SEND) &&
        !isGlobalView &&
        isNativeAsset &&
        classifiedTx.effect.assetId !== contextToken.assetId;

      if (isGlobalView) {
        displayAssetMetadata = txMetadata;
        displayAssetId = classifiedTx.effect.assetId;
        displayAssetAmount = classifiedTx.effect.amount;
      }

      
      
      else if (classifiedTx.effect.assetId === contextToken.assetId && classifiedTx.type !== TRANSACTION_TYPES.TOKEN_APPROVAL) {
        displayAssetMetadata = txMetadata;
        displayAssetId = classifiedTx.effect.assetId;
        displayAssetAmount = classifiedTx.effect.amount;
      }

      
      else if (shouldShowNetworkFee) {
        isNetworkFee = true;
        displayAssetMetadata = contextToken.metadata;
        displayAssetId = contextToken?.assetId;
        displayAssetAmount = BigNumber(item.fee ?? '')
          .negated()
          .toString(10);

        
        detailsAssetAmount = classifiedTx.type === TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED ? '' : classifiedTx.effect.amount;
        detailsAssetId = classifiedTx.effect.assetId;

        const assetSymbol = txMetadata?.symbol ?? '';
        descriptionIcon = <TokenIcon size={DESC_ICON_SIZE} tokenSymbol={assetSymbol} forceOmitNetworkIcon={!isGlobalView} wallet={wallet} />;
        description =
          classifiedTx.type === TRANSACTION_TYPES.SEND
            ? String(loc.formatString(loc.transactionTile.nativeAssetView.send, { assetSymbol }))
            : loc.transactionTile.nativeAssetView.approval;
      }

      
      
      else if (isNativeAsset && item.fee && classifiedTx.type !== TRANSACTION_TYPES.RECEIVE) {
        displayAssetMetadata = contextToken.metadata;
        displayAssetId = contextToken?.assetId;
        displayAssetAmount = BigNumber(item.fee).negated().toString(10);
      }

      
      else {
        displayAssetId = undefined;
        displayAssetAmount = undefined;
      }

      
      if (shouldShowNetworkFee) {
        icon = <SvgIcon name="gas-fee" style={styles.icon} gradientIconBackground />;
      }

      
      else if (wallet.nativeTokenCaipId === classifiedTx.effect.assetId) {
        icon = (
          <TokenIcon
            forceOmitNetworkIcon={!isGlobalView}
            networkName={wallet.nativeTokenLabel ? (wallet.nativeTokenLabel.toLowerCase() as WalletType) : wallet.type}
            size={IMG_SIZE}
            style={styles.image}
            testID={`Icon-${testID}`}
            tokenId={classifiedTx.effect.assetId}
            tokenSymbol={txMetadata?.symbol}
            wallet={wallet}
          />
        );
      }

      
      else {
        icon = <TokenIcon size={IMG_SIZE} tokenSymbol={txMetadata?.symbol ?? ''} wallet={wallet} forceOmitNetworkIcon={!isGlobalView} style={styles.image} />;
      }
      break;
    }
    case 'contract': {
      if (isGlobalView) {
        displayAssetMetadata = txMetadata;
      }
      
      
      else if (!item.fee) {
        displayAssetId = undefined;
        displayAssetAmount = undefined;

        title = loc.transactionTile.type.contractInteractionAffected;
      }
      
      else if (isNativeAsset) {
        isNetworkFee = true;
        description = loc.transactionTile.nativeAssetView.contractInteraction;
        displayAssetMetadata = contextToken.metadata;
        displayAssetId = contextToken?.assetId;
        displayAssetAmount = BigNumber(item.fee ?? '')
          .negated()
          .toString(10);
      } else {
        displayAssetMetadata = contextToken.metadata;
        displayAssetId = contextToken?.assetId;
        displayAssetAmount = BigNumber(item.fee ?? '')
          .negated()
          .toString(10);
      }
      icon = <ContractInteraction wallet={wallet} forceOmitNetworkIcon={!isGlobalView} />;
      break;
    }
    case 'nft':
      throw new Error('should use TransactionRowNft for nft transaction');
    default: {
      const exhaustiveCheck: never = classifiedTx;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }

  
  const isBtc = wallet.type === 'HDsegwitBech32';
  let btcFeesInSmallestUnit;
  if (isBtc && item.fee) {
    btcFeesInSmallestUnit = unitConverter.tokenUnit2SmallestUnit(item.fee, displayAssetMetadata?.decimals ?? 8).toNumber();
  }
  
  const tokenAmountAndNetworkFee =
    classifiedTx.type !== TRANSACTION_TYPES.RECEIVE && isNativeAsset && !isNetworkFee && item.fee && displayAssetAmount
      ? 
        (BigNumber(displayAssetAmount).isGreaterThan(0) ? BigNumber(displayAssetAmount).negated() : BigNumber(displayAssetAmount))
          .minus(BigNumber(btcFeesInSmallestUnit || item.fee))
          .toString(10)
      : undefined;

  title = title === '' ? getTransactionTitle(classifiedTx.type) : title;
  description =
    description ||
    ('description' in classifiedTx
      ? classifiedTx.description
      : parsedTx.protocolInfo?.projectId || formatTransactionAddress(parsedTx.metadata?.target, classifiedTx.type ?? ''));

  
  
  const isNativeAssetViewTokenOnlyTransaction = isNativeAsset && (!displayAssetAmount || displayAssetAmount === '0' || displayAssetAmount === 'NaN');

  return {
    icon,
    isNetworkFee,
    isSwapSent,
    description,
    descriptionIcon,
    detailsAssetAmount,
    detailsAssetId,
    displayAssetMetadata,
    displayAssetId,
    displayAssetAmount,
    isNativeAssetViewTokenOnlyTransaction,
    title,
    tokenAmountAndNetworkFee,
  };
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    borderRadius: 20,
    height: 40,
    width: 40,
    marginRight: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    borderRadius: 24,
    marginRight: 12,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
});
