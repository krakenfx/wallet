import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { analyseUrl } from '@/api/analyseUrl';

import { getImplForWallet } from '@/onChain/wallets/registry';
import { useIsTestnetEnabled } from '@/realm/settings';
import type { RealmWallet } from '@/realm/wallets';
import { Routes } from '@/Routes';

import type { PageInfo } from '../types';

import { getAccountsFromMatchedWallets } from '/modules/wallet-connect/connectAppWithWalletConnect/getAccountsFromMatchedWallets';
import { getWalletConnectSupportedNetworkIds } from '/modules/wallet-connect/hooks';

import { isSolanaNetwork } from '/modules/wallet-connect/utils';

export const useConnectDappModal = () => {
  const { navigate, goBack } = useNavigation();
  const isTestnetEnabled = useIsTestnetEnabled();

  const openModal = useCallback(
    async (wallet: RealmWallet, pageInfo: PageInfo | null, domain: string, baseUrl: string) => {
      const accounts = await getAccountsFromMatchedWallets([wallet], false);
      const { isMalicious } = await analyseUrl(baseUrl, [...accounts.eip155, ...accounts.solana]);
      const { network } = getImplForWallet(wallet);
      const isSolana = isSolanaNetwork(network);
      const networkIds = getWalletConnectSupportedNetworkIds(isTestnetEnabled, isSolana ? 'solana' : 'evm');

      return new Promise<boolean>((resolve, reject) => {
        navigate(Routes.ConnectApp, {
          isMalicious,
          uiState: undefined,
          onApprove: async () => {
            resolve(true);
            goBack();
          },
          onReject: async () => {
            reject(false);
            goBack();
          },
          appMetadata: {
            url: baseUrl,
            icon: pageInfo?.iconUrl,
            name: pageInfo?.title ?? domain,
          },
          networkIDs: networkIds,
          requiredNetworkIDs: [],
        });
      });
    },
    [goBack, navigate, isTestnetEnabled],
  );

  return useMemo(
    () => ({
      openModal,
    }),
    [openModal],
  );
};
