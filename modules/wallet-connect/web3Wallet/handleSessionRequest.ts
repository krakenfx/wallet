import { SessionTypes } from '@walletconnect/types';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types/types/client';
import Realm from 'realm';

import { getImplForWallet } from '@/onChain/wallets/registry';
import { REALM_TYPE_WALLET, RealmWallet } from '@/realm/wallets/schema';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { WALLET_CONNECT_SUPPORTED_SESSION_NAMESPACE_KEYS } from '../consts';
import { ReactNavigationDispatch } from '../types';
import { isEVMHarmonyTransport, isEVMNetwork, isSolanaNetwork, isSolanaTransport, splitWalletString } from '../utils';

import * as ethereum from './ethereum';
import { WALLET_CONNECT_ETH_SIGN_TYPES } from './ethereum/types';
import * as solana from './solana';
import { WALLET_CONNECT_SOLANA_SIGN_TYPES } from './solana/types';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

type SessionRequestParams = {
  web3Wallet: IWeb3Wallet;
  event: Web3WalletTypes.SessionRequest;
  dispatch: ReactNavigationDispatch;
  realm: Realm;
  getSeed: SecuredKeychainContext['getSeed'];
};

export async function handleSessionRequest({ event, dispatch, realm, web3Wallet, getSeed }: SessionRequestParams) {
  
  try {
    const {
      topic,
      params: { chainId, request },
      id,
      verifyContext: { verified },
    } = event;
    const { method, params: requestParams } = request;
    const activeSessions = await web3Wallet?.getActiveSessions();

    if (!activeSessions || !activeSessions[topic]) {
      return handleError('Topic not found', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }

    
    const supportedWallet = findSupportedWallet({ activeSessions, chainId, topic });

    if (!supportedWallet) {
      return handleError('Account not found', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }

    
    const foundWallet: RealmWallet | undefined = await findUserWallet(realm, supportedWallet);

    if (!foundWallet) {
      return handleError('Wallet not found', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }

    if (typeof foundWallet.accountIdx !== 'number') {
      return handleError('Wallet not found', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }

    const { network, transport } = getImplForWallet(foundWallet);

    switch (method) {
      
      case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN:
      case WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN:
      case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA_V4:
      case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA: {
        if (!isEVMNetwork(network) || !isEVMHarmonyTransport(transport)) {
          handleError(`Unsupported network: ${network}`, 'ERROR_CONTEXT_PLACEHOLDER', {
            icon: 'plug-disconnected',
            text: loc.walletConnect.unsupported_network,
          });
          break;
        }

        
        if (!ethereum.areMessageRequestParamsValid(requestParams)) {
          handleError('Invalid  request params', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
          break;
        }

        await ethereum.handleSessionRequestMessage({
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
        });
        break;
      }

      
      case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TRANSACTION:
      case WALLET_CONNECT_ETH_SIGN_TYPES.SEND_TRANSACTION: {
        if (!isEVMNetwork(network) || !isEVMHarmonyTransport(transport)) {
          handleError(`Unsupported network: ${network}`, 'ERROR_CONTEXT_PLACEHOLDER', {
            icon: 'plug-disconnected',
            text: loc.walletConnect.unsupported_network,
          });
          break;
        }

        const transaction = requestParams[0];

        await ethereum.handleSessionRequestTransaction({
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
        });
        break;
      }

      
      case WALLET_CONNECT_SOLANA_SIGN_TYPES.SIGN_MESSAGE: {
        if (!isSolanaNetwork(network)) {
          handleError(`Unsupported network: ${network}`, 'ERROR_CONTEXT_PLACEHOLDER', {
            icon: 'plug-disconnected',
            text: loc.walletConnect.unsupported_network,
          });
          break;
        }

        await solana.handleSessionRequestMessage({
          activeSessions,
          foundWallet,
          id,
          dispatch,
          network,
          message: requestParams as solana.SolanaSignMessage,
          topic,
          web3Wallet,
          getSeed,
          verified,
        });
        break;
      }

      
      case WALLET_CONNECT_SOLANA_SIGN_TYPES.SIGN_TRANSACTION: {
        if (!isSolanaNetwork(network) || !isSolanaTransport(transport)) {
          handleError(`Unsupported network: ${network}`, 'ERROR_CONTEXT_PLACEHOLDER', {
            icon: 'plug-disconnected',
            text: loc.walletConnect.unsupported_network,
          });
          break;
        }

        await solana.handleSessionRequestTransaction({
          activeSessions,
          foundWallet,
          id,
          dispatch,
          network,
          realm,
          topic,
          transaction: requestParams as solana.SolanaSignTransaction,
          transport,
          web3Wallet,
          getSeed,
          verified,
        });
        break;
      }

      default: {
        handleError('Method not implemented', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
        const response = { id, jsonrpc: '2.0', error: { code: 5001, message: 'Unsupported method' } };
        await web3Wallet.respondSessionRequest({ topic, response });
        break;
      }
    }
  } catch (error) {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
  }
}


function findSupportedWallet({ activeSessions, chainId, topic }: { activeSessions: Record<string, SessionTypes.Struct>; chainId: string; topic: string }) {
  let result;

  for (let i = 0, ii = WALLET_CONNECT_SUPPORTED_SESSION_NAMESPACE_KEYS.length; i < ii; i++) {
    const namespaceKey = WALLET_CONNECT_SUPPORTED_SESSION_NAMESPACE_KEYS[i];
    const supportedWallet_ = activeSessions[topic].namespaces?.[namespaceKey]?.accounts.find(walletString => walletString.startsWith(chainId + ':'));

    if (supportedWallet_) {
      result = supportedWallet_;
      break;
    }
  }

  return result;
}


async function findUserWallet(realm: Realm, supportedWallet: string): Promise<RealmWallet | undefined> {
  
  
  const allWalletsForAllAccounts = realm.objects<RealmWallet>(REALM_TYPE_WALLET) ?? [];
  const [chain, chainID, address] = splitWalletString(supportedWallet);

  let result;

  for (const wallet of allWalletsForAllAccounts) {
    const { network } = getImplForWallet(wallet);
    if (network.caipId === `${chain}:${chainID}` && (await network.deriveAddress(wallet)) === address) {
      result = wallet;
      break;
    }
  }

  return result;
}
