import '@ethersproject/shims';

import type { PropsWithChildren } from 'react';

import type React from 'react';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LogBox, Platform, StatusBar, StyleSheet, Text, type TextProps, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/base/fetchClient';
import { LongPressOverlay, LongPressProvider } from '@/components/LongPress';
import { useSecureAppLock } from '@/hooks/useSecureAppLock';
import { RealmQueueProvider } from '@/realm/hooks/useRealmQueue';
import { SecuredRealmProvider } from '@/realm/SecuredRealmProvider';
import { AppInBackground } from '@/screens/AppInBackground';

import { UnencryptedRealmProvider } from '@/unencrypted-realm/RealmContext';

import { runMigrations } from '@/utils/migrations';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ExploreNavigator } from './components/ExploreNavigator';
import { GlobalStateProvider } from './components/GlobalState';
import { MenuProvider } from './components/Menu';
import { ToastManager } from './components/Toast';
import NavigationStack from './Navigation';
import { SecuredKeychainProvider } from './secureStore/SecuredKeychainProvider';
import { SuperDarkTheme } from './theme/themes';

import { appendLog, applogFilePath, handleError } from '/helpers/errorHandler';

type _Text = typeof Text & { defaultProps: Partial<TextProps> };
(Text as _Text).defaultProps = (Text as _Text).defaultProps || {};
(Text as _Text).defaultProps.allowFontScaling = false;

LogBox.ignoreLogs([
  'Require cycle:',
  "Warning: Can't perform a React state",
  'Non-serializable values were found in the navigation state',
  'Importing FullWindowOverlay is only valid on iOS devices',
  '"n" is not a valid color or brush',
  'socketDidDisconnect with nil clientDelegate for 0',
  '`useBottomSheetDynamicSnapPoints` will be deprecated in the next major release!',
  '[Reanimated] Reduced motion setting is enabled on this device.',
  '[Reanimated] Tried to modify key `reduceMotion` of an object which has been already passed to a worklet',
  '[Reanimated] Property "opacity" of AnimatedComponent(TouchableOpacity) may be overwritten by a layout animation',

  '[Reanimated] Reading from `value` during component render.',
  '[Reanimated] Writing to `value` during component render.',
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

  return (
    <AppLockGuard>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <NavigationContainer theme={SuperDarkTheme}>
            <UnencryptedRealmProvider>
              <SecuredRealmProvider>
                <GlobalStateProvider>
                  <RealmQueueProvider>
                    <QueryClientProvider client={queryClient}>
                      <ErrorBoundary onError={onJSError}>
                        <LongPressProvider>
                          <MenuProvider>
                            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                            <BottomSheetModalProvider>
                              <SecuredKeychainProvider>
                                <NavigationStack />
                                <ExploreNavigator />
                              </SecuredKeychainProvider>
                            </BottomSheetModalProvider>
                          </MenuProvider>
                          <LongPressOverlay />
                        </LongPressProvider>
                      </ErrorBoundary>
                      <ToastManager />
                      <AppInBackground />
                    </QueryClientProvider>
                  </RealmQueueProvider>
                </GlobalStateProvider>
              </SecuredRealmProvider>
            </UnencryptedRealmProvider>
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
