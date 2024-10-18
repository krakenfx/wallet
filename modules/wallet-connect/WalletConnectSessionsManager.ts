import { SessionTypes } from '@walletconnect/types';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types/types/client';

import { getImplForWallet } from '@/onChain/wallets/registry';
import { RealmWallet } from '@/realm/wallets';

import { SessionNamespace } from './types';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export interface WCSessionsManager {
  approveSession(sessionProposalID: number, namespaces: SessionNamespace): void;
  disconnectSession(sessionTopic: string): Promise<void>;
  disconnectAccountSessions(accountWallets: RealmResults<RealmWallet>): void;
  getAccountWalletAddresses(accountWallets: RealmResults<RealmWallet>): Promise<string[]>;
  getAccountSessions(accountWallets: RealmResults<RealmWallet>): Promise<Record<string, SessionTypes.Struct>>;
  setWeb3Wallet(web3Wallet: IWeb3Wallet): void;
}

export const userDisconnectReason = {
  code: 2,
  message: 'User disconnected',
};


function logger({ type, message }: { type: string; message: string }) {
  console.log(type, message);
}





function getWalletAddressFromWCAccount(wcAccount: string): string {
  return wcAccount.split(':').reverse()?.[0] ?? '';
}




export class WalletConnectSessionsManager implements WCSessionsManager {
  private _web3Wallet?: IWeb3Wallet;
  private _usedDeepLink: boolean = false;

  setWeb3Wallet(web3Wallet: IWeb3Wallet) {
    this._web3Wallet = web3Wallet;
  }

  async getAccountWalletAddresses(accountWallets: RealmResults<RealmWallet>): Promise<string[]> {
    const accountWalletsList: string[] = [];

    for (const wallet of accountWallets) {
      const { network } = getImplForWallet(wallet);
      const address = await network.deriveAddress(wallet);
      accountWalletsList.push(address);
    }

    return accountWalletsList;
  }

  async approveSession(
    sessionProposalID: number,
    namespaces: SessionNamespace,
    callback?: { onError?: (error: Error) => void; onSuccess?: (response: any) => void },
  ) {
    await this._web3Wallet
      ?.approveSession({
        id: sessionProposalID,
        namespaces,
      })
      .then(response => {
        callback?.onSuccess?.(response);
        logger({ type: 'approveSession', message: `sessionProposalID: ${sessionProposalID}, namespaces: ${JSON.stringify(namespaces)}` });
      })
      .catch((err: Error) => {
        handleError(err, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.walletConnect.failedToConnect, icon: 'plug-disconnected' });
        callback?.onError?.(err);
      });
  }

  async disconnectSession(sessionTopic: string, callback?: { onError?: (error: Error) => void; onSuccess?: (topic: string) => void }) {
    await this._web3Wallet
      ?.disconnectSession({ topic: sessionTopic, reason: userDisconnectReason })
      .then(() => {
        callback?.onSuccess?.(sessionTopic);
        logger({ type: 'disconnectSession', message: `topic: ${sessionTopic}, reason: ${JSON.stringify(userDisconnectReason)}` });
      })
      .catch((err: Error) => {
        handleError(err, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.walletConnect.failedToDisconnect, icon: 'plug-disconnected' });
        callback?.onError?.(err);
      });
  }

  
  async getAccountSessions(accountWallets: RealmResults<RealmWallet>) {
    
    try {
      const allAccountSessions = (await this._web3Wallet?.getActiveSessions()) ?? {};
      const accountWalletAddresses = await this.getAccountWalletAddresses(accountWallets);

      
      const accountSessions: Record<string, SessionTypes.Struct> = {};

      Object.entries(allAccountSessions).forEach(([k, v]) => {
        const namespaces = Object.values(v.namespaces);

        for (let i = 0, ii = namespaces.length; i < ii; i++) {
          const n = namespaces[i];
          const addresses = (n.accounts || []).map(getWalletAddressFromWCAccount);

          const isFoundInWallets = addresses.some(a => {
            return accountWalletAddresses.includes(a);
          });

          if (isFoundInWallets) {
            
            accountSessions[k] = { ...v };

            
            
            
            break;
          }
        }
      });

      return accountSessions;
    } catch (error) {
      logger({ type: 'getAccountSessions', message: `accountWallets: ${accountWallets}, error: ${error?.toString()}` });

      return {};
    }
  }

  async disconnectAccountSessions(
    accountWallets: RealmResults<RealmWallet>,
    callback?: { onError?: (error: Error) => void; onSuccess?: (sessionId: string) => void },
  ) {
    const topics = Object.keys((await this.getAccountSessions(accountWallets)) || {});

    topics.forEach(topic => this.disconnectSession(topic, callback));
  }

  async disconnectAllSessionsForAllAccounts(callback?: { onError?: (error: Error) => void; onSuccess?: (topic: string) => void }) {
    
    try {
      const topics = Object.keys((await this._web3Wallet?.getActiveSessions()) || {});

      topics.forEach(topic => this.disconnectSession(topic, callback));
    } catch (error) {
      logger({ type: 'disconnectAllSessionsForAllAccounts', message: `error: ${error?.toString()}` });
    }
  }
}
