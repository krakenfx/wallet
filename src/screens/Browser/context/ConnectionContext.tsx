import React, { type PropsWithChildren, useCallback, useMemo } from 'react';

import { useContext } from 'react';

import { showToast } from '@/components/Toast';
import { useCurrentAccountNumber } from '@/realm/accounts';

import { useDappPermissions } from '@/realm/dappIntegration';
import { useDappPermissionMutations } from '@/realm/dappIntegration/useDappPermissionMutations';
import { useWalletConnectTopicsMutations } from '@/realm/walletConnectTopics/useWalletConnectTopicsMutations';

import { useRealmWallets } from '@/realm/wallets';

import { useBrowserContext } from './BrowserContext';

import loc from '/loc';
import { WalletConnectSessionsManager } from '/modules/wallet-connect';
import { useWalletConnectActiveSessions } from '/modules/wallet-connect/hooks';

interface ConnectionContextProps {
  triggerNativeDisconnect: () => void;
}

interface ConnectionContextValue {
  isConnected: boolean;
  handleDisconnect: () => void;
}

const ConnectionContext = React.createContext<ConnectionContextValue | undefined>(undefined);

export const ConnectionContextProvider: React.FC<PropsWithChildren<ConnectionContextProps>> = ({ children, triggerNativeDisconnect }) => {
  const { url, cleanUrl } = useBrowserContext();
  const currentAccountNumber = useCurrentAccountNumber();
  const [activeSessions, setActiveSessions] = useWalletConnectActiveSessions(currentAccountNumber);
  const accountWallets = useRealmWallets();
  const { deleteSession } = useWalletConnectTopicsMutations();

  const hasPermissionsToAccount = useDappPermissions(cleanUrl);
  const { revokePermissions } = useDappPermissionMutations();

  const currentWCConnection = useMemo(() => {
    if (!url) {
      return false;
    }

    return activeSessions.find(session => getUrlHostName(session.peer.metadata.url) === getUrlHostName(url));
  }, [activeSessions, url]);

  const handleDisconnect = useCallback(async () => {
    if (!cleanUrl) {
      return;
    }

    if (!currentWCConnection) {
      triggerNativeDisconnect();
      revokePermissions(cleanUrl);
      return;
    }

    try {
      await WalletConnectSessionsManager.disconnectSession(currentWCConnection.topic, {
        onSuccess: () => {
          deleteSession(currentWCConnection.topic);
        },
      });

      setActiveSessions(Object.values(await WalletConnectSessionsManager.getAccountSessions(accountWallets)));
    } catch (e) {
      showToast({ type: 'error', text: loc.connectedApps.app_details.error });
    }
  }, [cleanUrl, currentWCConnection, accountWallets, revokePermissions, triggerNativeDisconnect, deleteSession, setActiveSessions]);

  return (
    <ConnectionContext.Provider
      value={{
        isConnected: !!currentWCConnection || hasPermissionsToAccount,
        handleDisconnect,
      }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = (): ConnectionContextValue => {
  const context = useContext(ConnectionContext);

  if (!context) {
    throw new Error('ConnectionContext not initialized');
  }

  return context;
};

function getUrlHostName(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (error) {
    return null;
  }
}
