import { SessionTypes, Verify } from '@walletconnect/types';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types/types/client';

import { showToast } from '@/components/Toast';
import { RealmishWallet } from '@/onChain/wallets/base';
import { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { ReactNavigationDispatch } from '../../types';
import { getWarningFromSimulation } from '../../utils';
import { navigateToSignGenericMessagePage } from '../navigateToSignGenericMessagePage';
import { responseRejected } from '../responseRejected';

import { WALLET_CONNECT_ETH_SIGN_TYPES } from './types';
import { adaptMessageToEVMMessageSimulationInput, adaptToGenericMessage } from './utils';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export const ethSignFnMap: Record<string, 'signMessage' | 'signPersonalMessage' | 'signTypedDataMessage'> = {
  [WALLET_CONNECT_ETH_SIGN_TYPES.SIGN]: 'signMessage',
  [WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN]: 'signPersonalMessage',
  [WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA_V4]: 'signTypedDataMessage',
  [WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA]: 'signTypedDataMessage',
};

export async function handleSessionRequestMessage({
  activeSessions,
  foundWallet,
  id,
  method,
  dispatch,
  network,
  requestParams,
  topic,
  web3Wallet,
  getSeed,
  transport,
  verified,
}: {
  activeSessions: Record<string, SessionTypes.Struct>;
  foundWallet: RealmishWallet;
  id: number;
  method: string;
  dispatch: ReactNavigationDispatch;
  network: EVMNetwork;
  requestParams: any;
  topic: string;
  web3Wallet: IWeb3Wallet;
  getSeed: SecuredKeychainContext['getSeed'];
  transport: EVMHarmonyTransport;
  verified: Verify.Context['verified'];
}) {
  
  
  const [rawMessage, contractAddress]: [string, string] = (() => {
    if (method === WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN) {
      return requestParams;
    }
    return [...requestParams].reverse();
  })();
  const genericMessage = adaptToGenericMessage(method, requestParams);
  const messageSimulationInput = adaptMessageToEVMMessageSimulationInput(method, genericMessage.rawMessage);
  const preparedMessage = await transport
    .prepareMessage({
      dAppOrigin: verified.origin,
      ...messageSimulationInput,
      network,
      walletData: foundWallet,
    })
    .catch(() => {});

  if (!preparedMessage || preparedMessage.isError) {
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('Response rejected', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
  }

  const warning = getWarningFromSimulation(preparedMessage.preventativeAction, preparedMessage.warnings);
  const approveSignRequest = await navigateToSignGenericMessagePage(
    dispatch,
    foundWallet.accountIdx as number,
    {
      imageUrl: activeSessions[topic].peer.metadata.icons[0],
      name: activeSessions[topic].peer.metadata.name,
      url: activeSessions[topic].peer.metadata.url,
    },
    genericMessage,
    [{ title: loc.appSignRequest.contractAddress, description: contractAddress }],
    warning,
  );

  if (approveSignRequest) {
    const seed = await getSeed('sign');
    if (!seed) {
      web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
      return handleError('Missing seed', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
    await showToast({ type: 'info', text: loc.walletConnect.action_in_progress });
    try {
      const signedMessage = await network[ethSignFnMap[method]]({ ...foundWallet, seed: { data: seed } }, rawMessage);

      await web3Wallet.respondSessionRequest({ topic, response: { id, result: signedMessage, jsonrpc: '2.0' } });

      await showToast({ type: 'success', icon: 'plug-connected', text: loc.walletConnect.request_fulfilled });
    } catch (error) {
      web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
      return handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  } else {
    
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('User rejected', 'ERROR_CONTEXT_PLACEHOLDER', { icon: 'plug-disconnected', text: loc.walletConnect.response_rejected });
  }
}
