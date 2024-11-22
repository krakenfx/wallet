import { compact } from 'lodash';
import { useCallback, useRef } from 'react';

import { fetchTokenMetadata } from '@/api/fetchTokenMetadata';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { getWalletStorage } from '@/onChain/wallets/walletState';
import { isPromiseFulfilled, isPromiseRejected } from '@/utils/promise';

import { REALM_TYPE_ASSET_METADATA } from '../assetMetadata';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';
import { useTokensMutations } from '../tokens';

import { getWalletsForMutations } from '../wallets';

import type { AssetMetadata } from '../assetMetadata';
import type { RealmWallet } from '../wallets';

import { handleError } from '/helpers/errorHandler';

export const useTokensFetch = () => {
  const realm = useRealm();
  const { saveTokensToRealm } = useTokensMutations();
  const { runInTransaction } = useRealmTransaction();
  const isFetchingAll = useRef<boolean>(false);

  const getTokenMetadata = useCallback(
    (assetId: string) => {
      const currentMetadata = realm.objectForPrimaryKey<AssetMetadata>(REALM_TYPE_ASSET_METADATA, assetId);
      if (currentMetadata && currentMetadata.isValid() && !currentMetadata.updateRequired) {
        return new Promise<AssetMetadata>(resolve => resolve(currentMetadata));
      }
      return fetchTokenMetadata(assetId);
    },
    [realm],
  );

  const fetchAndUpdateTokens = useCallback(async (): Promise<boolean> => {
    if (isFetchingAll.current) {
      return true;
    }
    isFetchingAll.current = true;
    const accountWallets = getWalletsForMutations(realm);
    const results = await Promise.allSettled(
      accountWallets.map(async wallet => {
        if (wallet.isValid()) {
          const { network, transport } = getImplForWallet(wallet);
          const walletStorage = await getWalletStorage(realm, wallet, true);
          const balances = await transport.fetchBalance(network, wallet, walletStorage, getTokenMetadata);
          return {
            balances,
            wallet,
          };
        }
      }),
    );

    const suceessResults = compact(results.filter(isPromiseFulfilled).map(({ value }) => value));

    runInTransaction(() => {
      for (const result of suceessResults) {
        saveTokensToRealm(result.balances, result.wallet);
      }
    });

    results.filter(isPromiseRejected).forEach(({ reason }) => handleError(reason, 'ERROR_CONTEXT_PLACEHOLDER'));
    isFetchingAll.current = false;
    return results.length === suceessResults.length;
  }, [getTokenMetadata, realm, runInTransaction, saveTokensToRealm]);

  const fetchBalance = useCallback(
    async (wallet: RealmWallet, refreshState: boolean) => {
      const { network, transport } = getImplForWallet(wallet);

      const balances = await transport.fetchBalance(network, wallet, await getWalletStorage(realm, wallet, refreshState), getTokenMetadata);
      return saveTokensToRealm(balances, wallet);
    },
    [realm, saveTokensToRealm, getTokenMetadata],
  );

  return {
    fetchAndUpdateTokens,
    fetchBalance,
  };
};
