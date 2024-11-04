import { useCallback } from 'react';
import Realm from 'realm';

import { makeWalletId } from '@/onChain/wallets/base';
import type { WalletType } from '@/onChain/wallets/registry';
import { TESTNET_COINS, getImplForType } from '@/onChain/wallets/registry';
import { getWalletName } from '@/utils/getWalletName';

import { REALM_TYPE_ACCOUNT } from '../accounts';

import { REALM_TYPE_ASSET_METADATA } from '../assetMetadata';
import { REALM_TYPE_DEFI } from '../defi';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { REALM_TYPE_NFT } from '../nfts';
import { useRealm } from '../RealmContext';

import { REALM_TYPE_TOKEN, useTokensFetch } from '../tokens';
import { REALM_TYPE_WALLET_TRANSACTION } from '../transactions';

import { REALM_TYPE_WALLET } from './schema';

import type { RealmWallet } from './schema';
import type { RealmAccount } from '../accounts';
import type { RealmAssetMetadata } from '../assetMetadata';
import type { RealmToken } from '../tokens';

import { handleError } from '/helpers/errorHandler';

export type AddWallet = (newWallet: { type: WalletType; seed: ArrayBuffer; accountIdx: number; addToGallery?: boolean }) => RealmWallet | undefined;

export const useWalletsMutations = () => {
  const realm = useRealm();
  const { fetchAndUpdateTokens } = useTokensFetch();
  const { runInTransaction } = useRealmTransaction();

  const addNewWallet = useCallback<AddWallet>(
    newWallet => {
      console.log('saving new wallet...', newWallet.type);
      const walletId = makeWalletId(newWallet);
      const { network } = getImplForType(newWallet.type);
      const { extendedPublicKey, chainCode } = network.getExtendedPublicKey(newWallet.seed, newWallet.accountIdx);
      return runInTransaction(() => {
        const wallet = realm.create<RealmWallet>(REALM_TYPE_WALLET, {
          id: walletId,
          type: newWallet.type,
          accountIdx: newWallet.accountIdx,
          caipId: network.caipId,
          nativeTokenSymbol: network.nativeTokenSymbol,
          nativeTokenCaipId: network.nativeTokenCaipId,
          nativeTokenDecimals: network.nativeTokenDecimals,
          nativeTokenLabel: network.nativeTokenLabel,
          chainCode,
          extendedPublicKey,
        });
        const account = realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, newWallet.accountIdx);
        if (account) {
          
          account.wallets.push(wallet);
        }
        
        realm.create<RealmToken>(REALM_TYPE_TOKEN, {
          id: `${wallet.id}:${wallet.nativeTokenCaipId}`,
          assetId: network.nativeTokenCaipId,
          walletId: wallet.id,
          balance: '0',
          inGallery: newWallet.addToGallery ? 'manuallyAdded' : null, 
          wallet,
          metadata: realm.create<RealmAssetMetadata>(
            REALM_TYPE_ASSET_METADATA,
            {
              assetId: wallet.nativeTokenCaipId,
              symbol: wallet.nativeTokenSymbol,
              label: getWalletName(wallet.type), 
              decimals: wallet.nativeTokenDecimals,
            },
            Realm.UpdateMode.Modified,
          ),
        });

        return wallet;
      });
    },
    [realm, runInTransaction],
  );

  const deleteWalletType = useCallback(
    (walletType2delete: string) => {
      console.log('--- delete Wallet Type HOOK', walletType2delete);
      runInTransaction(() => {
        
        const tokensToDelete = realm.objects(REALM_TYPE_TOKEN).filtered(`wallet.type = '${walletType2delete}'`);
        realm.delete(tokensToDelete);
        const defiToDelete = realm.objects(REALM_TYPE_DEFI).filtered(`wallet.type = '${walletType2delete}'`);
        realm.delete(defiToDelete);
        const nftsToDelete = realm.objects(REALM_TYPE_NFT).filtered(`wallet.type = '${walletType2delete}'`);
        realm.delete(nftsToDelete);
        const transactionsToDelete = realm.objects(REALM_TYPE_WALLET_TRANSACTION).filtered(`wallet.type = '${walletType2delete}'`);
        realm.delete(transactionsToDelete);
        
        const walletsToDelete = realm.objects(REALM_TYPE_WALLET).filtered(`type = '${walletType2delete}'`);
        realm.delete(walletsToDelete);
      });
    },
    [realm, runInTransaction],
  );

  const addWalletsIfNeeded = useCallback(
    (walletTypes: WalletType[], seed: ArrayBuffer | false) => {
      if (!seed) {
        return;
      }
      const createWallets = async () => {
        runInTransaction(async () => {
          const existingAccounts = realm.objects<RealmAccount>(REALM_TYPE_ACCOUNT);
          
          const walletsToAdd = [];
          for (const account of existingAccounts) {
            const existingWalletTypes = account.wallets.map(w => w.type);
            for (const type of walletTypes) {
              if (existingWalletTypes.includes(type)) {
                continue;
              }
              walletsToAdd.push({
                type,
                accountIdx: account.accountNumber,
              });
            }
          }
          if (walletsToAdd.length > 0) {
            for (const wallet of walletsToAdd) {
              addNewWallet({ ...wallet, seed });
            }
          }
        });
      };
      createWallets();
    },
    [addNewWallet, realm, runInTransaction],
  );

  const enableTestnetWallets = useCallback(
    (seed: ArrayBuffer) => {
      try {
        addWalletsIfNeeded(TESTNET_COINS, seed);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
      fetchAndUpdateTokens();
    },
    [addWalletsIfNeeded, fetchAndUpdateTokens],
  );

  const disableTestnetWallets = useCallback(() => {
    try {
      runInTransaction(() => {
        for (const testnetWalletType of TESTNET_COINS) {
          deleteWalletType(testnetWalletType);
        }
      });
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
    }
  }, [deleteWalletType, runInTransaction]);

  return {
    addNewWallet,
    deleteWalletType,
    enableTestnetWallets,
    disableTestnetWallets,
  };
};
