import type { GestureResponderEvent, NativeSyntheticEvent } from 'react-native';

import WebView from '@metamask/react-native-webview';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Touchable } from '@/components/Touchable';
import { useDappMethods } from '@/dAppIntegration/hooks/useDappMethods';
import { useRandomSecret } from '@/dAppIntegration/hooks/useRandomSecret.ts';
import { getInjectedScriptString } from '@/dAppIntegration/scripts';

import solanaSdk from '@/dAppIntegration/solanaSdk-1.95.4.min.js.raw';
import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';
import { useBrowserContext } from '../../context/BrowserContext';

import { useSearchContext } from '../../context/SearchContext';
import { getHttpsUrl } from '../../utils/getHttpsUrl';

import { hasPunycode } from '../../utils/hasPunycode';
import { BrowserBlockaidWarningSheet } from '../BrowserBlockaidWarningSheet';
import { LoadingBar } from '../BrowserLoadingBar';
import { BrowserLoadingFailure } from '../BrowserLoadingFailure';
import { BrowserNoSearch } from '../BrowserNoSearch';
import { BrowserPunycodeWarningSheet } from '../BrowserPunycodeWarningSheet';

import { BrowserSearchResult } from '../BrowserSearchResult';

import type { BrowserWebViewRef } from './BrowserWebView.types';
import type { WebViewErrorEvent, WebViewNavigationEvent } from '@metamask/react-native-webview/lib/RNCWebViewNativeComponent';
import type { ShouldStartLoadRequest } from '@metamask/react-native-webview/lib/WebViewTypes';

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

  const secret = useRandomSecret();

  const { onMessage, disconnect } = useDappMethods(webViewRef, secret);

  const { animatedWebViewStyle } = useBrowserAnimationContext();

  const { searchValue, showSearchBar, hideSearch, changeSearchValue } = useSearchContext();

  const [showPunycodeWarning, setShowPunycodeWarning] = useState(false);
  const [currentPunycodeUrl, setCurrentPunycodeUrl] = useState<string | null>(null);

  const resetPunycode = () => {
    setShowPunycodeWarning(false);
    setCurrentPunycodeUrl(null);
  };

  const onShouldStartLoadWithRequest = (request: ShouldStartLoadRequest) => {
    if (request.url.startsWith('about:')) {
      return true;
    }

    if (
      hasPunycode(request.url) &&
      ((Platform.OS === 'ios' && request.navigationType === 'click') || (Platform.OS === 'android' && request.url !== currentPunycodeUrl))
    ) {
      setShowPunycodeWarning(true);
      setCurrentPunycodeUrl(request.url);
      return false;
    }

    const mainDocumentURL = request.mainDocumentURL ? getHttpsUrl(request.mainDocumentURL) : null;
    if (mainDocumentURL !== getHttpsUrl(request.url)) {
      return true;
    }

    if (request.url.startsWith('https://')) {
      if (getHttpsUrl(request.url) !== null) {
        changeSearchValue(request.url);
        return true;
      }
    }

    if (request.url.startsWith('http://')) {
      const httpsUrl = getHttpsUrl(request.url);

      if (!httpsUrl) {
        return false;
      }

      setUrl(httpsUrl);
      changeSearchValue(httpsUrl);

      return false;
    }

    return false;
  };

  const handleLoadEnd = (event: NativeSyntheticEvent<WebViewErrorEvent | WebViewNavigationEvent>) => {
    if (Platform.OS === 'android' && url) {
      changeSearchValue(url);
    }

    onLoadEnd(event);
  };

  const navigateBack = useCallback(() => {
    if (!navigationState.canNavigateBack) {
      return;
    }

    if (Platform.OS === 'android' && error) {
      setShouldDisplayWebView(false);
    }

    webViewRef.current?.goBack();
  }, [webViewRef, navigationState, error, setShouldDisplayWebView]);

  const navigateForward = useCallback(() => {
    if (!navigationState.canNavigateForward) {
      return;
    }

    if (Platform.OS === 'android' && error) {
      setShouldDisplayWebView(false);
    }

    webViewRef.current?.goForward();
  }, [webViewRef, navigationState, error, setShouldDisplayWebView]);

  const hidePunycodeWarning = () => setShowPunycodeWarning(false);

  const ignorePunycodeWarning = () => {
    if (currentPunycodeUrl) {
      setUrl(getHttpsUrl(currentPunycodeUrl));
    }

    resetPunycode();
  };

  useImperativeHandle(
    ref,
    () => ({
      disconnect,
      navigateBack,
      navigateForward,
      reloadPage: () => {
        webViewRef.current?.reload();
      },
    }),
    [webViewRef, navigateBack, navigateForward, disconnect],
  );

  useAndroidBackButton(() => {
    navigateBack();
    return true;
  });

  const handleOnFileDownload = useCallback(() => {
    return false;
  }, []);

  const isSearchResultVisible = showSearchBar && searchValue !== '' && searchValue !== url;
  const hideWebView = !shouldDisplayWebView || error || isSearchResultVisible;

  return (
    <>
      <View style={styles.container}>
        {isLoading ? <LoadingBar percentage={loadingPercentage} /> : null}

        {isSearchResultVisible ? <BrowserSearchResult /> : null}

        {error ? <BrowserLoadingFailure /> : null}

        {}
        {showSearchBar && !isSearchResultVisible ? (
          <View style={styles.hideSearchOverlayContainer}>
            <Touchable onPress={hideSearch} style={styles.hideSearchOverlayContent} />
          </View>
        ) : null}

        {url ? (
          <Animated.View style={[{ flex: 1, display: hideWebView ? 'none' : 'flex' }, animatedWebViewStyle]}>
            <WebView
              pullToRefreshEnabled
              mediaPlaybackRequiresUserAction
              allowsInlineMediaPlayback
              allowsBackForwardNavigationGestures
              ref={webViewRef}
              style={[styles.webView, { opacity: hideWebView ? 0 : 1 }]}
              source={{ uri: url }}
              setSupportMultipleWindows={false}
              originWhitelist={['https://', 'http://', 'about:']}
              decelerationRate="normal"
              onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
              onNavigationStateChange={onNavigationStateChange}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onLoadStart={onLoadStart}
              onLoadProgress={onLoadProgress}
              onLoadEnd={handleLoadEnd}
              onError={onLoadError}
              onMessage={onMessage}
              onFileDownload={handleOnFileDownload}
              injectedJavaScript={getInjectedScriptString(secret, Platform.OS, solanaSdk)}
              renderError={() => <BrowserLoadingFailure />}
            />
          </Animated.View>
        ) : (
          <BrowserNoSearch />
        )}
      </View>

      <BrowserPunycodeWarningSheet
        url={currentPunycodeUrl}
        showPunycodeWarning={showPunycodeWarning}
        hidePunycodeWarning={hidePunycodeWarning}
        ignorePunycodeWarning={ignorePunycodeWarning}
      />

      <BrowserBlockaidWarningSheet url={url} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  hideSearchOverlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  hideSearchOverlayContent: {
    height: '100%',
    width: '100%',
  },
});
