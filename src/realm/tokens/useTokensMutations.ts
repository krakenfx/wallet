import { useCallback } from 'react';
import Realm from 'realm';

import type { BalanceResponse } from '@/onChain/wallets/base';
import type { RemoteAsset } from '@/types';
import { adaptTokenReputationToRealmAssetReputation } from '@/utils/adaptTokenReputationToRealmAssetReputation';

import { REALM_TYPE_ASSET_METADATA } from '../assetMetadata';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN } from './schema';

import type { RealmToken, Token } from './schema';
import type { RealmAssetMetadata } from '../assetMetadata';
import type { RealmWallet } from '../wallets';

export const useTokensMutations = () => {
  const realm = useRealm();
  const { runInTransaction } = useRealmTransaction();

  const saveTokensToRealm = useCallback(
    (records: BalanceResponse[], wallet: RealmWallet) => {
      console.log('[useTokensMutations] saving tokens and metadata ' + wallet.id + ' ' + records.length.toString());
      runInTransaction(() => {
        const isSolanaWallet = wallet.type === 'solana' || wallet.type === 'solanaDevnet';
        const solanaTokensSaved = [];
        for (const record of records) {
          const id = `${wallet.id}:${record.balance.token}`;
          const balance = record.balance.value ?? '0';
          const reputation = adaptTokenReputationToRealmAssetReputation(record.metadata.reputation);

          const token = realm.create<RealmToken>(
            REALM_TYPE_TOKEN,
            {
              id,
              assetId: record.balance.token,
              walletId: wallet.id,
              balance,
              wallet,
              metadata: realm.create<RealmAssetMetadata>(
                REALM_TYPE_ASSET_METADATA,
                {
                  assetId: record.balance.token,
                  symbol: record.metadata.symbol ?? '',
                  logoUrl: record.metadata.logoUrl,
                  label: record.metadata.label ?? '',
                  decimals: record.metadata.decimals,
                  tokenAddress: record.metadata.tokenAddress,
                  subLabels: record.metadata.subLabels,
                  description: record.metadata.description,
                  reputation,
                  updateRequired: false,
                },
                Realm.UpdateMode.Modified,
              ),
            },
            Realm.UpdateMode.All,
          );

          if (isSolanaWallet) {
            solanaTokensSaved.push(token.assetId);
          }
        }

        if (isSolanaWallet) {
          const solanaTokensNeedingZeroBalance = realm.objects(REALM_TYPE_TOKEN).filtered('walletId = $0 AND assetId == NONE $1', wallet.id, solanaTokensSaved);

          solanaTokensNeedingZeroBalance.forEach(t => {
            t.balance = '0';
          });
        }
      });
    },
    [realm, runInTransaction],
  );

  const addTokenToRealm = useCallback(
    (token: RemoteAsset, wallet: RealmWallet): RealmToken => {
      console.log('[useTokensMutations] adding remote asset as token' + ' ' + token.assetId + ' ' + wallet.id);
      return realm.write(() => {
        return realm.create<RealmToken>(
          REALM_TYPE_TOKEN,
          {
            id: `${wallet.id}:${token.assetId}`,
            assetId: token.assetId,
            walletId: wallet.id,
            balance: token.balance ?? '0',
            wallet,
            inGallery: 'manuallyAdded',
            metadata: realm.create<RealmAssetMetadata>(
              REALM_TYPE_ASSET_METADATA,
              {
                assetId: token.assetId,
                symbol: token.metadata.symbol ?? '',

                label: token.metadata.label ?? '',
                decimals: token.metadata.decimals,
                reputation: token.metadata.reputation,
              },
              Realm.UpdateMode.Modified,
            ),
          },
          Realm.UpdateMode.Never,
        );
      });
    },
    [realm],
  );

  const removeTokenFromRealm = useCallback(
    (walletId: string, assetId: string) => {
      const toDelete = realm.objects(REALM_TYPE_TOKEN).filtered('walletId = $0 AND assetId = $1', walletId, assetId);

      if (toDelete) {
        realm.write(() => {
          realm.delete(toDelete);
        });
      }
    },
    [realm],
  );

  const setTokenGalleryStatus = useCallback(
    (token: RealmToken, status: Token['inGallery']) => {
      if (status) {
        realm.write(() => {
          token.inGallery = status;
        });
      }
    },
    [realm],
  );

  return {
    addTokenToRealm,
    removeTokenFromRealm,
    saveTokensToRealm,
    setTokenGalleryStatus,
  };
};
