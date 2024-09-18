import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

import { isAuthenticating } from '/helpers/biometric-unlock';
import ActivityLifecycle from '/modules/activity-lifecycle';


function useAppStateAndroid() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      throw Error('useAppStateAndroid not supported on ' + Platform.OS);
    }
    const onStoppedListener = ActivityLifecycle.addListener('onActivityStopped', () => setAppState('background'));
    const onResumedListener = ActivityLifecycle.addListener('onActivityResumed', () => setAppState('active'));
    return () => {
      onStoppedListener.remove();
      onResumedListener.remove();
    };
  }, []);

  return appState;
}


function useAppStateAndroidOldApi() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', newState => {
      if (isAuthenticating) {
        return;
      }
      setAppState(newState);
    });
    return () => subscription.remove();
  }, []);

  return appState;
}

function useAppStateDefault() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setAppState(state));
    return () => subscription.remove();
  }, []);

  return appState;
}

let useAppState = useAppStateDefault;

if (Platform.OS === 'android') {
  useAppState = Platform.Version >= 30 ? useAppStateAndroid : useAppStateAndroidOldApi;
}

export { useAppState };
