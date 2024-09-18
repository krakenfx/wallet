
import '@ethersproject/shims';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { LogBox, Platform, StatusBar, StyleSheet, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LongPressOverlay, LongPressProvider } from '@/components/LongPress';
import { useSecureAppLock } from '@/hooks/useSecureAppLock';
import { RealmQueueProvider } from '@/realm/hooks/useRealmQueue';
import { SecuredRealmProvider } from '@/realm/SecuredRealmProvider';
import { AppInBackground } from '@/screens/AppInBackground';
import '@/utils/featureFlags';

import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalStateProvider } from './components/GlobalState';
import { MenuProvider } from './components/Menu';
import { ToastManager } from './components/Toast';
import NavigationStack from './Navigation';
import { SecuredKeychainProvider } from './secureStore/SecuredKeychainProvider';
import { SuperDarkTheme } from './theme/themes';
import { runMigrations } from './utils/migrations';

import { appendLog, applogFilePath, handleError } from '/helpers/errorHandler';

LogBox.ignoreLogs([
  'Require cycle:',
  "Warning: Can't perform a React state",
  'Non-serializable values were found in the navigation state',
  'Importing FullWindowOverlay is only valid on iOS devices',
  '"n" is not a valid color or brush',
  'socketDidDisconnect with nil clientDelegate for 0',
  '`useBottomSheetDynamicSnapPoints` will be deprecated in the next major release!',
]);

console.log('applogFilePath:', applogFilePath);
if (!__DEV__) {
  
  const _log = (...args: unknown[]) => appendLog(args, 'log');
  console.log = console.warn = console.error = _log;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

if (Platform.OS === 'android') {
  
  StatusBar.setTranslucent(true);
}

const AppLockGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const { appUnlocked } = useSecureAppLock();
  if (!appUnlocked) {
    return null;
  }
  return <>{children}</>;
};

const onJSError = (error: unknown) => handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');

const App = () => {
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  useEffect(() => {
    const performMigrations = async () => {
      await runMigrations();
      setMigrationCompleted(true);
    };
    performMigrations();
  }, []);

  if (!migrationCompleted) {
    return null;
  }

  const linking = {
    prefixes: [
      'krakenwallet://wc?uri=',
      'krakenwallet:wc?uri=',
      
      'wc:',
      'wc://',
    ],
    config: {
      screens: {
        ConnectAppQRScan: '*',
      },
    },
  };

  return (
    <AppLockGuard>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <NavigationContainer linking={linking} theme={SuperDarkTheme}>
            <SecuredRealmProvider>
              <GlobalStateProvider>
                <RealmQueueProvider>
                  <ErrorBoundary onError={onJSError}>
                    <LongPressProvider>
                      <MenuProvider>
                        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                        <BottomSheetModalProvider>
                          <SecuredKeychainProvider>
                            <NavigationStack />
                          </SecuredKeychainProvider>
                        </BottomSheetModalProvider>
                      </MenuProvider>
                      <LongPressOverlay />
                    </LongPressProvider>
                  </ErrorBoundary>
                  <ToastManager />
                  <AppInBackground />
                </RealmQueueProvider>
              </GlobalStateProvider>
            </SecuredRealmProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppLockGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SuperDarkTheme.colors.background,
  },
});

export default App;
