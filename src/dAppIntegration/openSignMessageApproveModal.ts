import type { PageInfo, RpcMethods } from '@/dAppIntegration/types';
import type { RealmishWallet } from '@/onChain/wallets/base';

import type { Verify } from '@walletconnect/types';

import loc from '/loc';
import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { adaptToGenericMessage } from '/modules/wallet-connect/web3Wallet/ethereum';
import { navigateToSignGenericMessagePage } from '/modules/wallet-connect/web3Wallet/navigateToSignGenericMessagePage';

interface Props {
  method: RpcMethods;
  requestParams: unknown[];
  wallet: RealmishWallet;
  dispatch: ReactNavigationDispatch;
  pageInfo: PageInfo;
  verified?: Verify.Context['verified']; 
}

export const openSignMessageApproveModal = async ({ requestParams, method, wallet, dispatch, pageInfo }: Props) => {
  const [_rawMessage, contractAddress] = requestParams;
  const genericMessage = adaptToGenericMessage(method, requestParams);

  return await navigateToSignGenericMessagePage(
    dispatch,
    wallet.accountIdx as number,
    {
      imageUrl: pageInfo.icon,
      name: '',
      url: pageInfo.url,
    },
    genericMessage,
    [{ title: loc.appSignRequest.contractAddress, description: contractAddress as string }],
  );
};
