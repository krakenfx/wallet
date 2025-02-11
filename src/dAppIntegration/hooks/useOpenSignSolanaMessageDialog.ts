import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import type { PageInfo } from '@/dAppIntegration/types';
import type { RealmWallet } from '@/realm/wallets';

import loc from '/loc';
import { navigateToSignGenericMessagePage } from '/modules/wallet-connect/web3Wallet/navigateToSignGenericMessagePage';

export type OpenSignSolanaMessageDialogArgs = {
  wallet: RealmWallet;
  pageInfo: PageInfo | null;
  domain: string;
  baseUrl: string;
  message: Uint8Array;
  address: string;
};

export const useOpenSignSolanaMessageDialog = () => {
  const { dispatch } = useNavigation();

  return useCallback(
    (args: OpenSignSolanaMessageDialogArgs) => {
      const textDecoder = new TextDecoder();
      const decodedMessage = textDecoder.decode(args.message);

      return navigateToSignGenericMessagePage(
        dispatch,
        args.wallet.accountIdx,
        {
          imageUrl: args.pageInfo?.iconUrl,
          name: args.pageInfo?.title ?? args.domain,
          url: args.baseUrl,
        },
        {
          type: 'generic-message',
          address: args.address,
          message: [{ title: loc.appSignRequest.message, description: decodedMessage }],
          rawMessage: decodedMessage,
        },
      );
    },
    [dispatch],
  );
};
