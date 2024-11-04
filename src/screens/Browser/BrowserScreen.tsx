import React, { useLayoutEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';

import type { NavigationProps } from '@/Routes';

import { navigationStyle } from '@/utils/navigationStyle';

import { BrowserHeader } from './components/BrowserHeader';

import { BrowserWebView } from './components/BrowserWebView';
import { BrowserAnimationContextProvider } from './context/BrowserAnimationContext';
import { BrowserContextProvider } from './context/BrowserContext';
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

  const onGoBack = () => navigation.goBack();

  const { headerExpanded, onExpandHeader, handleTouchStart, handleTouchMove } = useHeader();

  const { url, customTransitionAnimation, goBackAnimations } = route.params;

  useLayoutEffect(() => {
    if (customTransitionAnimation) {
      navigation.setOptions({
        animation: customTransitionAnimation,
      });
    }
  }, []);

  return (
    <BrowserContextProvider
      initialUrl={url}
      isConnectedToDapp={false}
      onGoBack={onGoBack}
      onRefreshPage={onRefreshPage}
      onNavigateBack={onNavigateBack}
      onNavigateForward={onNavigateForward}>
      <SearchContextProvider>
        <BrowserAnimationContextProvider onGoBack={onGoBack} goBackAnimations={goBackAnimations}>
          <GradientScreenView style={styles.container}>
            <BrowserHeader headerExpanded={headerExpanded} onExpandHeader={onExpandHeader} />

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
