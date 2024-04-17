import { useMemo } from 'react';
import Realm from 'realm';

import { REPUTATION, getAssetReputation, useReputation } from '@/hooks/useReputation';
import { getNftMetadata } from '@/realm/nftMetadata';

import { MinimalTransaction, TransactionData, getTransactionMetadata } from './getTransactionMetadata';

const shouldFilterOutTransactionByReputation = (
  reputation: REPUTATION,
  classifiedTx: TransactionData,
  filterInUnverifiedAssets: boolean,
  filterInBlacklistedAssets: boolean,
  isSpam?: boolean | null | undefined,
) => {
  if (filterInBlacklistedAssets && filterInUnverifiedAssets) {
    return false;
  } else if (isSpam && !filterInBlacklistedAssets) {
    return true;
  } else if (classifiedTx.kind === 'simple' && classifiedTx.type === 'receive') {
    if ((!filterInBlacklistedAssets && reputation === REPUTATION.BLACKLISTED) || (!filterInUnverifiedAssets && reputation === REPUTATION.UNVERIFIED)) {
      return true;
    }
  }
  return false;
};

const getAssetIdFromTxMetadata = (classifiedTx: TransactionData) => {
  return classifiedTx.kind === 'simple' && classifiedTx.type === 'receive' ? classifiedTx.effect.assetId.toString() : '';
};

export const useShouldFilterOutTransactionByReputation = (
  classifiedTx: TransactionData,
  filterInUnverifiedAssets: boolean,
  filterInBlacklistedAssets: boolean,
  isSpam?: boolean | null | undefined,
): boolean => {
  const reputation = useReputation(getAssetIdFromTxMetadata(classifiedTx));

  return useMemo(
    () => shouldFilterOutTransactionByReputation(reputation, classifiedTx, filterInUnverifiedAssets, filterInBlacklistedAssets, isSpam),
    [filterInBlacklistedAssets, filterInUnverifiedAssets, reputation, classifiedTx, isSpam],
  );
};

export const getShouldFilterOutTransactionByReputation = (
  realm: Realm,
  tx: MinimalTransaction,
  filterInUnverifiedAssets: boolean,
  filterInBlacklistedAssets: boolean,
) => {
  const txMetadata = getTransactionMetadata(tx);
  const assetNftId = txMetadata.kind === 'nft' ? txMetadata?.nft?.assetId : undefined;
  const nftMetadata = assetNftId ? getNftMetadata(realm, assetNftId) : undefined;
  const isSpam = nftMetadata?.isSpam;
  const reputation = getAssetReputation(realm, getAssetIdFromTxMetadata(txMetadata));
  return shouldFilterOutTransactionByReputation(reputation, txMetadata, filterInUnverifiedAssets, filterInBlacklistedAssets, isSpam);
};
