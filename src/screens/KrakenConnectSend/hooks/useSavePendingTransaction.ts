import { useCallback } from 'react';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { useKrakenTokenListQuery } from '@/reactQuery/hooks/useTokenListsQuery';
import { type RealmToken, useTokens } from '@/realm/tokens';
import { type PendingTransaction, useTransactionMutations } from '@/realm/transactions';
import type { RealmWallet } from '@/realm/wallets';
import type { RemoteAsset } from '@/types';

interface Props {
  tx: Omit<PendingTransaction, 'tokenId'>;
  wallet: RealmWallet;
  krakenAsset: KrakenAssetSupported;
}

export const useGetRealmToken = () => {
  const tokens = useTokens();
  const getRealmToken = useCallback(
    (krakenAsset: KrakenAssetSupported, wallet: RealmWallet) => {
      const filteredTokens = tokens.filtered(`walletId == $0 AND metadata.symbol ==[c] $1`, wallet.id, krakenAsset.metadata.symbol);
      if (filteredTokens.length > 0) {
        return filteredTokens[0];
      }
      return undefined;
    },
    [tokens],
  );

  return {
    getRealmToken,
  };
};

const useGetRemoteAsset = () => {
  const { data: remoteAssets } = useKrakenTokenListQuery();

  const getRemoteAsset = useCallback(
    (krakenAsset: KrakenAssetSupported, wallet: RealmWallet) => {
      return remoteAssets?.find(
        asset =>
          asset.metadata.symbol.toLowerCase() === krakenAsset.symbol.toLowerCase() &&
          wallet.type.toLocaleLowerCase === asset.metadata.walletType.toLocaleLowerCase,
      );
    },
    [remoteAssets],
  );
  return {
    getRemoteAsset,
  };
};

export const useSavePendingTransaction = () => {
  const { savePendingTransaction } = useTransactionMutations();
  const { getRealmToken } = useGetRealmToken();
  const { getRemoteAsset } = useGetRemoteAsset();

  const savePendingTxFromKrakenExchange = useCallback(
    ({ wallet, krakenAsset, tx }: Props) => {
      const realmToken: RealmToken | undefined = getRealmToken(krakenAsset, wallet);
      let remoteToken: RemoteAsset | undefined = undefined;
      if (!realmToken) {
        remoteToken = getRemoteAsset(krakenAsset, wallet);
      }

      const asset = realmToken || remoteToken;
      if (!asset) {
        throw new Error('Asset not found');
      }

      savePendingTransaction(
        {
          ...tx,
          tokenId: asset.assetId,
        },
        wallet,
      );
      return {
        shouldCreateRealmToken: !realmToken,
        remoteToken,
        wallet,
      };
    },
    [getRealmToken, getRemoteAsset, savePendingTransaction],
  );

  return {
    savePendingTxFromKrakenExchange,
  };
};
