import { addEventListener } from '@react-native-community/netinfo';
import { throttle } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';

import { clearAllToastErrors, hideToast, showToast } from '@/components/Toast';
import { ConnectionEmitter, connectMain, electrumConnectionEmitter, resetElectrumMainClient } from '@/onChain/blueElectrumModules';
import { useCurrentAccountNumberOrUndefined } from '@/realm/accounts';
import { useRefreshStateActions } from '@/realm/refreshManagerHooks';
import { Routes } from '@/Routes';
import { useAppState } from '@/utils/useAppState';

import loc from '/loc';

const OFFLINE = 'OFFLINE';
const CONNECTION_ERROR = 'CONNECTION_ERROR';
const ELECTRUM_RECONNECTING = 'ELECTRUM_RECONNECTING';

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = addEventListener(
      throttle(
        state => {
          if (state.isInternetReachable !== isOnline) {
            setIsOnline(state.isInternetReachable);
          }
        },
        100,
        { leading: false },
      ),
    );
    return unsubscribe;
  }, [isOnline]);

  return isOnline;
};

const TIME_TO_REFRESH = 60000; 
export const useConnectionManager = () => {
  const isOnline = useIsOnline();
  const { refreshAll } = useRefreshStateActions();
  const [isElectrumConnected, setIsElectrumConnected] = useState(false);
  const wasOffline = useRef<boolean>();
  const currentAccountNumber = useCurrentAccountNumberOrUndefined();
  const appState = useAppState();
  const lastAppInBackgroundTime = useRef<number | undefined>();

  const shouldRefreshElectrum = useCallback(() => {
    const now = Date.now();
    return lastAppInBackgroundTime.current !== undefined && now - lastAppInBackgroundTime.current >= TIME_TO_REFRESH;
  }, []);

  useEffect(() => {
    const checkIfRefreshAll = () => {
      switch (appState) {
        case 'active': {
          if (shouldRefreshElectrum()) {
            setIsElectrumConnected(false);
            resetElectrumMainClient();
          }
          break;
        }
        case 'background': {
          if (!lastAppInBackgroundTime.current) {
            lastAppInBackgroundTime.current = Date.now();
          }
        }
      }
    };
    checkIfRefreshAll();
  }, [appState, shouldRefreshElectrum]);

  useEffect(() => {
    connectMain();
  }, []);

  const onElectrumDisconnected = useCallback(() => {
    setIsElectrumConnected(false);
    if (isOnline) {
      showToast({ id: CONNECTION_ERROR, text: loc.errors.connectionError, type: 'error', icon: 'plug-disconnected' });
    }
  }, [isOnline]);

  const onElectrumConnected = useCallback(() => {
    hideToast({ id: ELECTRUM_RECONNECTING });
    setIsElectrumConnected(true);
    lastAppInBackgroundTime.current = undefined;
  }, []);

  useEffect(() => {
    electrumConnectionEmitter.on(ConnectionEmitter.disconnected, onElectrumDisconnected);
    electrumConnectionEmitter.on(ConnectionEmitter.connected, onElectrumConnected);
    return () => {
      electrumConnectionEmitter.off(ConnectionEmitter.disconnected, onElectrumDisconnected);
      electrumConnectionEmitter.off(ConnectionEmitter.connected, onElectrumConnected);
    };
  }, [onElectrumConnected, onElectrumDisconnected]);

  useEffect(() => {
    if (isOnline === false) {
      
      showToast({ id: OFFLINE, dismissMode: 'event', text: loc.errors.offline, type: 'info', icon: 'no-internet' });
      wasOffline.current = true;
    } else {
      hideToast({ id: OFFLINE });
      if (wasOffline.current) {
        clearAllToastErrors();
        showToast({ id: ELECTRUM_RECONNECTING, type: 'info', icon: 'plug-connected', text: loc._.reconnecting, blackListRoutes: [Routes.Onboarding] });
        wasOffline.current = false;
        resetElectrumMainClient();
      }
    }
  }, [isOnline]);

  useEffect(() => {
    const checkIfRefreshAll = () => {
      if (isElectrumConnected && currentAccountNumber !== undefined) {
        lastAppInBackgroundTime.current = undefined;
        
        
        InteractionManager.runAfterInteractions(() => {
          refreshAll();
        });
      }
    };
    checkIfRefreshAll();
  }, [isElectrumConnected, refreshAll, currentAccountNumber]);
};
