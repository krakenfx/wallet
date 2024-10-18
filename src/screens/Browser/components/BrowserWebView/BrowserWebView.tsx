import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { GestureResponderEvent, Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import WebView from 'react-native-webview';

import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';
import { useBrowserContext } from '../../context/BrowserContext';

import { useSearchContext } from '../../context/SearchContext';

import { getHttpsUrl } from '../../utils/getHttpsUrl';

import { LoadingBar } from '../BrowserLoadingBar';
import { BrowserLoadingFailure } from '../BrowserLoadingFailure';
import { BrowserNoSearch } from '../BrowserNoSearch';
import { BrowserSearchResult } from '../BrowserSearchResult';

import { BrowserWebViewRef } from './BrowserWebView.types';

interface BrowserWebViewProps {
  handleTouchMove: (event: GestureResponderEvent) => void;
  handleTouchStart: (event: GestureResponderEvent) => void;
}

export const BrowserWebView = forwardRef<BrowserWebViewRef, BrowserWebViewProps>(({ handleTouchStart, handleTouchMove }, ref) => {
  const webViewRef = useRef<WebView>(null);

  const {
    url,
    setUrl,
    shouldDisplayWebView,
    setShouldDisplayWebView,
    navigationState,
    loadingPercentage,
    isLoading,
    error,
    onNavigationStateChange,
    onLoadStart,
    onLoadProgress,
    onLoadEnd,
    onLoadError,
  } = useBrowserContext();

  const { animatedWebViewStyle } = useBrowserAnimationContext();

  const { searchValue, showSearchBar, changeSearchValue } = useSearchContext();

  const onShouldStartLoadWithRequest = (request: ShouldStartLoadRequest) => {
    if (request.url.startsWith('https://')) {
      changeSearchValue(request.url);
      return true;
    }

    if (request.url.startsWith('http://')) {
      const httpsUrl = getHttpsUrl(request.url);
      setUrl(httpsUrl);
    }

    
    return false;
  };

  useImperativeHandle(
    ref,
    () => ({
      navigateBack: () => {
        if (!navigationState.canNavigateBack) {
          return;
        }

        if (Platform.OS === 'android' && error) {
          setShouldDisplayWebView(false);
        }

        webViewRef.current?.goBack();
      },
      navigateForward: () => {
        if (!navigationState.canNavigateForward) {
          return;
        }

        if (Platform.OS === 'android' && error) {
          setShouldDisplayWebView(false);
        }

        webViewRef.current?.goForward();
      },
      reloadPage: () => {
        webViewRef.current?.reload();
      },
    }),
    [navigationState, webViewRef],
  );

  const isSearchResultVisible = showSearchBar && searchValue !== '';
  const hideWebView = !shouldDisplayWebView || error || isSearchResultVisible;

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingBar percentage={loadingPercentage} /> : null}

      {isSearchResultVisible ? <BrowserSearchResult /> : null}

      {error ? <BrowserLoadingFailure /> : null}

      {url ? (
        <Animated.View style={[{ flex: 1, display: hideWebView ? 'none' : 'flex' }, animatedWebViewStyle]}>
          <WebView
            pullToRefreshEnabled
            mediaPlaybackRequiresUserAction
            ref={webViewRef}
            
            style={[styles.webView, { opacity: hideWebView ? 0 : 1 }]}
            source={{ uri: url }}
            setSupportMultipleWindows={false}
            originWhitelist={['https://', 'http://']}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onNavigationStateChange={onNavigationStateChange}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onLoadStart={onLoadStart}
            onLoadProgress={onLoadProgress}
            onLoadEnd={onLoadEnd}
            onError={onLoadError}
            renderError={() => <BrowserLoadingFailure />} 
          />
        </Animated.View>
      ) : (
        <BrowserNoSearch />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
