import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { analyseUrl } from '@/api/analyseUrl';

import type { PageInfo } from '@/dAppIntegration/types';
import { useWalletByType } from '@/realm/wallets/useWalletByType';

import { Routes } from '@/Routes';

import { getAccountsFromMatchedWallets } from '/modules/wallet-connect/connectAppWithWalletConnect/getAccountsFromMatchedWallets';
import { useWalletConnectSupportedNetworkIds } from '/modules/wallet-connect/hooks';

export const useConnectDappModal = () => {
  const { navigate, goBack } = useNavigation();

  const wallet = useWalletByType('ethereum');
  const networkIds = useWalletConnectSupportedNetworkIds('evm');

  const openModal = useCallback(
    async (pageInfo: PageInfo | null, domain: string, baseUrl: string) => {
      const accounts = await getAccountsFromMatchedWallets([wallet], false);
      const allAccounts = accounts.eip155;
      const analyseUrlResult = await analyseUrl(baseUrl, allAccounts);

      return new Promise((resolve, reject) => {
        navigate(Routes.ConnectApp, {
          isMalicious: analyseUrlResult.isMalicious,
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
    [goBack, navigate, networkIds, wallet],
  );
  return {
    openModal,
  };
};
