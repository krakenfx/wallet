import { SessionTypes, Verify } from '@walletconnect/types';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types/types/client';
import Realm from 'realm';

import { RealmishWallet } from '@/onChain/wallets/base';
import { SolanaHarmonyTransport, SolanaNetwork } from '@/onChain/wallets/solana';
import { WalletStorage, getWalletStorage } from '@/onChain/wallets/walletState';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { handleRedirect } from '../../connectAppWithWalletConnect/handleRedirect';
import { ReactNavigationDispatch } from '../../types';
import { getWarningFromSimulation } from '../../utils';
import { navigateToSignGenericTransactionPage } from '../navigateToSignGenericTransactionPage';
import { responseRejected } from '../responseRejected';
import { sessionIsDeepLinked } from '../sessionIsDeepLinked';

import { SolanaSignTransaction } from './types';
import { adaptSolanaSignTransactionToDefinitionList, getWalletConnectRespondSessionRequestResult } from './utils';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export async function handleSessionRequestTransaction({
  activeSessions,
  foundWallet,
  id,
  dispatch,
  network,
  realm,
  transaction,
  transport,
  topic,
  web3Wallet,
  getSeed,
  verified,
}: {
  activeSessions: Record<string, SessionTypes.Struct>;
  foundWallet: RealmishWallet;
  id: number;
  dispatch: ReactNavigationDispatch;
  network: SolanaNetwork;
  realm: Realm;
  topic: string;
  transaction: SolanaSignTransaction;
  transport: SolanaHarmonyTransport;
  web3Wallet: IWeb3Wallet;
  getSeed: SecuredKeychainContext['getSeed'];
  verified: Verify.Context['verified'];
}) {
  const preparedTransaction = await transport
    .prepareTransaction(network, foundWallet, (await getWalletStorage(realm, foundWallet, true)) as WalletStorage<unknown>, {
      transaction: transaction.transaction,
      dAppOrigin: verified.origin,
    })
    .catch(() => {});

  if (!preparedTransaction || preparedTransaction.isError) {
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('Response rejected', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
  }

  const warning = getWarningFromSimulation(preparedTransaction.preventativeAction, preparedTransaction.warnings);
  const { approveSignRequest } = await navigateToSignGenericTransactionPage(
    dispatch,
    foundWallet,
    {
      imageUrl: activeSessions[topic].peer.metadata.icons[0],
      name: activeSessions[topic].peer.metadata.name,
      url: activeSessions[topic].peer.metadata.url,
    },
    [],
    adaptSolanaSignTransactionToDefinitionList(transaction),
    preparedTransaction,
    
    
    true,
    warning,
  );

  if (approveSignRequest) {
    try {
      const seed = await getSeed('sign');
      if (!seed) {
        web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
        return handleError('Missing seed', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
      }

      const signedTransaction = await network.signTransaction({ ...foundWallet, seed: { data: seed } }, preparedTransaction.data);
      const result = getWalletConnectRespondSessionRequestResult(transaction, signedTransaction);

      await web3Wallet.respondSessionRequest({ topic, response: { id, result, jsonrpc: '2.0' } });
      const isDeepLinked = sessionIsDeepLinked(realm, topic);
      await handleRedirect(activeSessions[topic], 'request_fulfilled', isDeepLinked);
    } catch (error) {
      web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
      return handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  } else {
    
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('User rejected', 'ERROR_CONTEXT_PLACEHOLDER', { icon: 'plug-disconnected', text: loc.walletConnect.response_rejected });
  }
}
