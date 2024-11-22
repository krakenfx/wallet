import type { EVMFeeOption } from '@/api/types';
import { showToast } from '@/components/Toast';
import type { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';
import type { WalletStorage } from '@/onChain/wallets/walletState';
import { getWalletStorage } from '@/onChain/wallets/walletState';
import { getAppCurrency } from '@/realm/settings/useAppCurrency';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { RealmWallet } from '@/realm/wallets';
import type { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { handleRedirect } from '../../connectAppWithWalletConnect/handleRedirect';

import { getWarningFromSimulation } from '../../utils';
import { getSignStructuredParamsFromTransaction, navigateToSignStructuredTransactionPage } from '../navigateToSignStructuredTransactionPage';
import { responseRejected } from '../responseRejected';
import { sessionIsDeepLinked } from '../sessionIsDeepLinked';

import { WALLET_CONNECT_ETH_SIGN_TYPES } from './types';
import { adaptTransactionObjectToDefinitionList, classifyTransaction } from './utils';

import type { TransactionObject } from './types';
import type { ReactNavigationDispatch } from '../../types';
import type { IWalletKit } from '@reown/walletkit/dist/types/types/client';
import type { SessionTypes, Verify } from '@walletconnect/types';
import type Realm from 'realm';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export async function handleSessionRequestTransaction({
  activeSessions,
  foundWallet,
  id,
  method,
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
  foundWallet: RealmWallet;
  id: number;
  method: string;
  dispatch: ReactNavigationDispatch;
  network: EVMNetwork;
  realm: Realm;
  transaction: TransactionObject;
  transport: EVMHarmonyTransport;
  topic: string;
  web3Wallet: IWalletKit;
  getSeed: SecuredKeychainContext['getSeed'];
  verified: Verify.Context['verified'];
}) {
  const preparedTransaction = await transport
    .prepareTransaction(network, foundWallet, (await getWalletStorage(realm, foundWallet, true)) as WalletStorage<unknown>, {
      ...transaction,
      dAppOrigin: verified.origin,
    })
    .catch(() => {});

  if (!preparedTransaction || preparedTransaction.isError) {
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('Response rejected', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
  }

  const warning = getWarningFromSimulation(preparedTransaction.preventativeAction, preparedTransaction.warnings);
  const classifiedTransaction = await classifyTransaction(preparedTransaction.effects);
  let approveSignRequest = false;
  let fee: EVMFeeOption | null = null;

  const currency = getAppCurrency(realm);

  const dappName = activeSessions[topic].peer.metadata.name;

  const { transactionTitle, content } = await getSignStructuredParamsFromTransaction({
    method,
    network,
    currency,
    preparedTransaction,
    dappName,
  });

  const { approveSignRequest: approveSignRequest_, fee: fee_ } = await navigateToSignStructuredTransactionPage({
    dispatch,
    wallet: foundWallet,
    metadata: {
      imageUrl: activeSessions[topic].peer.metadata.icons[0],
      name: dappName,
      url: activeSessions[topic].peer.metadata.url,
    },
    transactionTitle,
    content,
    detailsContent: adaptTransactionObjectToDefinitionList(transaction, network),
    preparedTransaction,
    hideFeeSelector: classifiedTransaction.type === TRANSACTION_TYPES.TOKEN_APPROVAL,
    warning,
  });

  approveSignRequest = approveSignRequest_;
  fee = fee_ as EVMFeeOption;

  if (approveSignRequest && fee !== null) {
    try {
      const seed = await getSeed('sign');
      if (!seed) {
        web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
        return handleError('Missing seed', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
      }

      const finalPreparedTransaction = await transport.prepareTransaction(
        network,
        foundWallet,
        (await getWalletStorage(realm, foundWallet, true)) as WalletStorage<unknown>,
        { ...transaction },
        fee,
        true,
      );

      await showToast({ type: 'info', text: loc.walletConnect.action_in_progress });

      const result = await network.signTransaction(
        {
          ...foundWallet,
          seed: {
            data: seed,
          },
        },
        finalPreparedTransaction.data,
      );

      if (method === WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TRANSACTION) {
        await web3Wallet.respondSessionRequest({ topic, response: { id, result: result, jsonrpc: '2.0' } });
      }

      if (method === WALLET_CONNECT_ETH_SIGN_TYPES.SEND_TRANSACTION) {
        const txid = await transport.broadcastTransaction(network, result);
        await web3Wallet.respondSessionRequest({ topic, response: { id, result: txid, jsonrpc: '2.0' } });
      }
      const isDeepLinked = sessionIsDeepLinked(realm, topic);

      await handleRedirect(activeSessions[topic], 'request_fulfilled', isDeepLinked);
    } catch (error) {
      web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
      return handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  } else {
    web3Wallet.respondSessionRequest({ topic, response: responseRejected(id) });
    return handleError('Response rejected', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.walletConnect.response_rejected });
  }
}
