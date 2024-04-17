import { useCallback } from 'react';
import Realm from 'realm';

import { useWipeStorage } from '@/hooks/useWipeStorage';

import { REALM_TYPE_ACCOUNT, RealmAccount } from '../accounts/schema';
import { REALM_TYPE_DEFI } from '../defi';
import { useRealmTransaction } from '../hooks/useRealmTransaction';
import { REALM_TYPE_NFT } from '../nfts';
import { useRealm } from '../RealmContext';
import { REALM_TYPE_SETTINGS, RealmSettings, RealmSettingsKey } from '../settings';
import { REALM_TYPE_TOKEN } from '../tokens';
import { REALM_TYPE_WALLET_TRANSACTION } from '../transactions';
import { REALM_TYPE_WALLET, RealmWallet } from '../wallets';

import { getAccountName } from './utils';

interface AddNewAccountProps {
  accountNumber: number;
  accountCustomName?: string;
}

export const useAccountsMutations = () => {
  const realm = useRealm();
  const { wipeStorage } = useWipeStorage();
  const { runInTransaction } = useRealmTransaction();

  const addNewAccount = ({ accountNumber, accountCustomName }: AddNewAccountProps) => {
    const accountWallets = realm.objects<RealmWallet>(REALM_TYPE_WALLET).filtered(`accountIdx = ${accountNumber}`);

    return runInTransaction(() => {
      const account = realm.create<RealmAccount>(
        REALM_TYPE_ACCOUNT,
        {
          accountNumber,
          accountCustomName: accountCustomName || getAccountName(accountNumber),
          balance: 0,
        },
        Realm.UpdateMode.Modified,
      );
      accountWallets.forEach(wallet => {
        account.wallets.push(wallet);
      });

      realm.create<RealmSettings>(
        REALM_TYPE_SETTINGS,
        {
          name: RealmSettingsKey.accountNumber,
          value: accountNumber,
        },
        Realm.UpdateMode.Modified,
      );
      return account;
    });
  };

  const editAccountCustomName = (accountNumber: number, accountCustomName: string) => {
    const account = realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, accountNumber);
    if (account) {
      realm.write(() => {
        account.accountCustomName = accountCustomName;
      });
    }
  };

  const setDidLoadOnce = useCallback(
    (account: RealmAccount) => {
      if (account) {
        realm.write(() => {
          account.didLoadOnce = true;
        });
      }
    },
    [realm],
  );

  const setCurrentAccountBalance = useCallback(
    (balance: number) => {
      const currentAccountNumber = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.accountNumber);
      if (currentAccountNumber) {
        const currentAccount = realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, currentAccountNumber.value as number);
        if (currentAccount && currentAccount.balance !== balance) {
          runInTransaction(() => {
            currentAccount.balance = balance;
          });
        }
      }
    },
    [realm, runInTransaction],
  );

  const deleteAccount = async (accountNumberToDelete: number): Promise<{ removedLastAccount: boolean }> => {
    const currentAccountNumber = realm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.accountNumber);
    const deletingCurrentAccount = currentAccountNumber && currentAccountNumber.value === accountNumberToDelete;

    const existingAccounts = realm.objects<RealmAccount>(REALM_TYPE_ACCOUNT);
    if (deletingCurrentAccount && existingAccounts.length === 1) {
      await wipeStorage();
      return {
        removedLastAccount: true,
      };
    }
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey<RealmAccount>(REALM_TYPE_ACCOUNT, accountNumberToDelete));

      const wallets = realm.objects<RealmWallet>(REALM_TYPE_WALLET).filtered(`accountIdx = ${accountNumberToDelete}`);

      wallets.forEach(realmWallet => {
        realm.delete(realm.objects(REALM_TYPE_WALLET_TRANSACTION).filtered(`walletId = '${realmWallet.id}'`));
        realm.delete(realm.objects(REALM_TYPE_DEFI).filtered(`walletId = '${realmWallet.id}'`));
        realm.delete(realm.objects(REALM_TYPE_NFT).filtered(`walletId = '${realmWallet.id}'`));
        realm.delete(realm.objects(REALM_TYPE_TOKEN).filtered(`walletId = '${realmWallet.id}'`));
      });

      realm.delete(wallets);

      const remainingAccounts = realm.objects<RealmAccount>(REALM_TYPE_ACCOUNT);

      realm.create<RealmSettings>(
        REALM_TYPE_SETTINGS,
        {
          name: RealmSettingsKey.accountNumber,
          value: remainingAccounts[0].accountNumber,
        },
        Realm.UpdateMode.Modified,
      );
    });
    return {
      removedLastAccount: false,
    };
  };

  return {
    addNewAccount,
    setDidLoadOnce,
    deleteAccount,
    editAccountCustomName,
    setCurrentAccountBalance,
  };
};
