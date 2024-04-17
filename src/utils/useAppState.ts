import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

import { isAuthenticating } from '/helpers/biometric-unlock';

export function useAppState() {
  const currentState = AppState.currentState;
  const [appState, setAppState] = useState(currentState);

  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      if (Platform.OS === 'android' && Platform.Version < 30 && isAuthenticating) {
        return;
      }
      setAppState(newState);
    }

    const subscription = AppState.addEventListener('change', onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}
