import { SessionTypes, Verify } from '@walletconnect/types';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types/types/client';
import bs58 from 'bs58';

import { showToast } from '@/components/Toast';
import { RealmishWallet } from '@/onChain/wallets/base';
import { SolanaNetwork } from '@/onChain/wallets/solana';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { GenericMessage, ReactNavigationDispatch } from '../../types';

import { navigateToSignGenericMessagePage } from '../navigateToSignGenericMessagePage';
import { responseRejected } from '../responseRejected';

import { SolanaSignMessage } from './types';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export async function handleSessionRequestMessage({
  activeSessions,
  foundWallet,
  id,
  dispatch,
  network,
  message,
  topic,
  web3Wallet,
  getSeed,
}: {
  activeSessions: Record<string, SessionTypes.Struct>;
  foundWallet: RealmishWallet;
  id: number;
  dispatch: ReactNavigationDispatch;
  network: SolanaNetwork;
  message: SolanaSignMessage;
  topic: string;
  web3Wallet: IWeb3Wallet;
  getSeed: SecuredKeychainContext['getSeed'];
  verified: Verify.Context['verified'];
}) {
  const genericMessage: GenericMessage = {
    type: 'generic-message',
    address: message.pubkey,
    message: [{ title: loc.appSignRequest.message, description: Buffer.from(bs58.decode(message.message)).toString('utf8') }],
  };

  const approveSignRequest = await navigateToSignGenericMessagePage(
    dispatch,
    foundWallet.accountIdx as number,
    {
      imageUrl: activeSessions[topic].peer.metadata.icons[0],
      name: activeSessions[topic].peer.metadata.name,
      url: activeSessions[topic].peer.metadata.url,
    },
    genericMessage,
    [{ title: loc.appSignRequest.contractAddress, description: genericMessage.address }],
  );

  if (approveSignRequest) {
    const seed = await getSeed('sign');

    if (!seed) {
      web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
      return handleError('Missing seed', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }

    await showToast({ type: 'info', text: loc.walletConnect.action_in_progress });

    try {
      const signedMessage = await network.signMessage({ ...foundWallet, seed: { data: seed } }, message.message);

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
