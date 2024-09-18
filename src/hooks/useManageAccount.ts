import { useCallback } from 'react';

import { fetchEnsName } from '@/api/fetchEnsName';
import { showToast } from '@/components/Toast';
import { ALL_MAINNET_COINS, DEFAULT_GALLERY_COINS, TESTNET_COINS, WalletType } from '@/onChain/wallets/registry';
import { RealmAccount, useAccounts, useAccountsMutations } from '@/realm/accounts';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useSettingsMutations } from '@/realm/settings';
import { useIsTestnetEnabled } from '@/realm/settings/useIsTestnetEnabled';
import { useWalletsMutations } from '@/realm/wallets';
import { RealmWallet } from '@/realm/wallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { WalletConnectSessionsManager } from '/modules/wallet-connect';

export const useManageAccount = () => {
  const { addNewWallet } = useWalletsMutations();
  const { setAccountNumber } = useSettingsMutations();
  const accounts = useAccounts();

  const { addNewAccount, deleteAccount } = useAccountsMutations();
  const { runInTransaction } = useRealmTransaction();
  const isTestnetEnabled = useIsTestnetEnabled();

  const { getSeed } = useSecuredKeychain();

  const assignENSNameIfPresent = useCallback(
    async (account: RealmAccount, ethWallet: RealmWallet) => {
      const ens = await fetchEnsName(ethWallet);
      if (ens) {
        runInTransaction(() => {
          account.accountCustomName = ens;
        });
      }
    },
    [runInTransaction],
  );

  const createAccount = useCallback(async () => {
    const seed = await getSeed('createWallet');
    const accountCustomName: string = '';
    if (!seed) {
      return;
    }
    try {
      const lastCreatedAccount = !accounts.isEmpty() ? accounts[accounts.length - 1] : undefined;
      if (lastCreatedAccount === undefined) {
        throw Error('No existing account to increment');
      }
      
      const nextAccountNumber = lastCreatedAccount.accountNumber + 1;
      const wallets: Partial<Record<WalletType, RealmWallet>> = {};
      runInTransaction(async () => {
        for (const type of ALL_MAINNET_COINS) {
          const wallet = addNewWallet({
            type,
            seed,
            accountIdx: nextAccountNumber,
            addToGallery: DEFAULT_GALLERY_COINS.includes(type),
          });
          wallets[type] = wallet;
        }
        if (isTestnetEnabled) {
          for (const type of TESTNET_COINS) {
            addNewWallet({
              type,
              seed,
              accountIdx: nextAccountNumber,
            });
          }
        }

        const account = addNewAccount({ accountNumber: nextAccountNumber, accountCustomName });
        if (wallets.ethereum) {
          assignENSNameIfPresent(account, wallets.ethereum);
        }
        console.log('switching global account number to', nextAccountNumber);
      });
      showToast({
        type: 'success',
        text: loc.accountSwitch.createWalletSuccess,
        hapticFeedbackOnShow: 'notificationSuccess',
      });
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.accountSwitch.createWalletError });
    }
  }, [getSeed, accounts, runInTransaction, isTestnetEnabled, addNewAccount, assignENSNameIfPresent, addNewWallet]);

  const switchAccount = useCallback(
    (accountNumber: number) => {
      console.log('switching global account number to', { accountNumber });
      setAccountNumber(accountNumber);
    },
    [setAccountNumber],
  );

  const removeAccount = async (accountNumber: number, accountWallets: RealmResults<RealmWallet>) => {
    try {
      const { removedLastAccount } = await deleteAccount(accountNumber);
      WalletConnectSessionsManager.disconnectAccountSessions(accountWallets);

      if (!removedLastAccount) {
        showToast({ type: 'success', text: loc.accountSwitch.walletDelete.success });
      }
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.accountSwitch.walletDelete.error });
    }
  };

  return { switchAccount, createAccount, removeAccount, assignENSNameIfPresent };
};
