import { useLayoutEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';

import type { NavigationProps } from '@/Routes';

import { navigationStyle } from '@/utils/navigationStyle';

import { BrowserHeader } from './components/BrowserHeader';

import { BrowserWebView } from './components/BrowserWebView';
import { BrowserAnimationContextProvider } from './context/BrowserAnimationContext';
import { BrowserContextProvider } from './context/BrowserContext';
import { ConnectionContextProvider } from './context/ConnectionContext';
import { SearchContextProvider } from './context/SearchContext';
import { useHeader } from './hooks/useHeader';

import type { BrowserWebViewRef } from './components/BrowserWebView';

export type BrowserParams = {
  url?: string;
  customTransitionAnimation?: 'fade';
  goBackAnimations?: {
    inputXShift: number;
    inputYShift: number;
    inputTargetWidth: number;
    inputContentXShift: number;
  };
};

export const BrowserScreen = ({ navigation, route }: NavigationProps<'Browser'>) => {
  const webViewRef = useRef<BrowserWebViewRef>(null);

  const onRefreshPage = () => webViewRef.current?.reloadPage();

  const onNavigateBack = () => webViewRef.current?.navigateBack();

  const onNavigateForward = () => webViewRef.current?.navigateForward();

  const onExitBrowser = () => navigation.goBack();

  const triggerNativeDisconnect = () => webViewRef.current?.disconnect();

  const { headerExpanded, onExpandHeader, handleTouchStart, handleTouchMove } = useHeader();

  const { url, customTransitionAnimation, goBackAnimations } = route.params;

  useLayoutEffect(
    () => {
      if (customTransitionAnimation) {
        navigation.setOptions({
          animation: customTransitionAnimation,
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <BrowserContextProvider
      initialUrl={url}
      onExitBrowser={onExitBrowser}
      onRefreshPage={onRefreshPage}
      onNavigateBack={onNavigateBack}
      onNavigateForward={onNavigateForward}>
      <SearchContextProvider>
        <BrowserAnimationContextProvider onExitBrowser={onExitBrowser} goBackAnimations={goBackAnimations}>
          <GradientScreenView style={styles.container}>
            <ConnectionContextProvider triggerNativeDisconnect={triggerNativeDisconnect}>
              <BrowserHeader headerExpanded={headerExpanded} onExpandHeader={onExpandHeader} />
            </ConnectionContextProvider>

            <BrowserWebView ref={webViewRef} handleTouchStart={handleTouchStart} handleTouchMove={handleTouchMove} />
          </GradientScreenView>
        </BrowserAnimationContextProvider>
      </SearchContextProvider>
    </BrowserContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

BrowserScreen.navigationOptions = navigationStyle({
  headerShown: false,
  animation: 'slide_from_bottom',
});
