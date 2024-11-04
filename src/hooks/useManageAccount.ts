import { useCallback } from 'react';

import { fetchEnsName } from '@/api/fetchEnsName';
import { fetchEnsOwnership } from '@/api/fetchEnsOwnership';
import { showToast } from '@/components/Toast';
import type { WalletType } from '@/onChain/wallets/registry';
import { ALL_MAINNET_COINS, DEFAULT_GALLERY_COINS, TESTNET_COINS } from '@/onChain/wallets/registry';
import type { RealmAccount } from '@/realm/accounts';
import { useAccounts, useAccountsMutations } from '@/realm/accounts';
import { useRealmTransaction } from '@/realm/hooks/useRealmTransaction';
import { useSettingsMutations } from '@/realm/settings';
import { useIsTestnetEnabled } from '@/realm/settings/useIsTestnetEnabled';
import { useWalletConnectTopicsMutations } from '@/realm/walletConnectTopics/useWalletConnectTopicsMutations';
import type { RealmWallet } from '@/realm/wallets';
import { useWalletsMutations } from '@/realm/wallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { WalletConnectSessionsManager } from '/modules/wallet-connect';

export const useManageAccount = () => {
  const { addNewWallet } = useWalletsMutations();
  const { setAccountNumber } = useSettingsMutations();
  const accounts = useAccounts();

  const { addNewAccount, deleteAccount } = useAccountsMutations();
  const { deleteSession } = useWalletConnectTopicsMutations();
  const { runInTransaction } = useRealmTransaction();
  const isTestnetEnabled = useIsTestnetEnabled();

  const { getSeed } = useSecuredKeychain();

  const assignENSNameIfPresent = useCallback(
    async (account: RealmAccount, ethWallet: RealmWallet) => {
      const ensName = await fetchEnsName(ethWallet);
      if (ensName) {
        const ensData = await fetchEnsOwnership(ensName);
        const avatar = ensData?.owner?.avatar;
        runInTransaction(() => {
          account.accountCustomName = ensName;
          account.avatar = avatar ?? null;
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
      await WalletConnectSessionsManager.disconnectAccountSessions(accountWallets, {
        onSuccess: async (sessionId: string) => {
          deleteSession(sessionId);
        },
      });

      const { removedLastAccount } = await deleteAccount(accountNumber);
      if (!removedLastAccount) {
        showToast({ type: 'success', text: loc.accountSwitch.walletDelete.success });
      }
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.accountSwitch.walletDelete.error });
    }
  };

  return { switchAccount, createAccount, removeAccount, assignENSNameIfPresent };
};
