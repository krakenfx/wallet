import type { PageInfo, RpcMethod } from '@/dAppIntegration/types';
import type { RealmishWallet } from '@/onChain/wallets/base';

import type { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';

import loc from '/loc';
import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { getWarningFromSimulation } from '/modules/wallet-connect/utils';
import { adaptMessageToEVMMessageSimulationInput, adaptToGenericMessage } from '/modules/wallet-connect/web3Wallet/ethereum';
import { navigateToSignGenericMessagePage } from '/modules/wallet-connect/web3Wallet/navigateToSignGenericMessagePage';

interface Props {
  method: RpcMethod;
  params: unknown[];
  wallet: RealmishWallet;
  dispatch: ReactNavigationDispatch;
  pageInfo: PageInfo | null;
  transport: EVMHarmonyTransport;
  network: EVMNetwork;
  domain: string;
  baseUrl: string;
}

export const openSignMessageApproveModal = async ({ params, transport, network, method, wallet, dispatch, pageInfo, domain, baseUrl }: Props) => {
  const [, contractAddress] = params;
  const genericMessage = adaptToGenericMessage(method, params);
  const messageSimulationInput = adaptMessageToEVMMessageSimulationInput(method, genericMessage.rawMessage);

  const preparedMessage = await transport.prepareMessage({
    dAppOrigin: baseUrl,
    ...messageSimulationInput,
    network,
    walletData: wallet,
  });

  if (preparedMessage.isError) {
    throw new Error('Transaction simulation failed');
  }

  const warning = getWarningFromSimulation(preparedMessage.preventativeAction, preparedMessage.warnings);

  return navigateToSignGenericMessagePage(
    dispatch,
    wallet.accountIdx as number,
    {
      imageUrl: pageInfo?.iconUrl,
      name: pageInfo?.title ?? domain,
      url: baseUrl,
    },
    genericMessage,
    [{ title: loc.appSignRequest.contractAddress, description: contractAddress as string }],
    warning,
  );
};
