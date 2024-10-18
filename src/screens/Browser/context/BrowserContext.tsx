import React, { PropsWithChildren, useContext, useState } from 'react';

import { NativeSyntheticEvent, Platform } from 'react-native';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { WebViewNavigation, WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';

import { getHttpsUrlOrGoogleSearchUrl } from '../utils/getHttpsUrlOrGoogleSearchUrl';

interface BrowserContextProps {
  initialUrl: string | undefined;
  isConnectedToDapp: boolean;
  onGoBack: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onRefreshPage: () => void;
}

interface NavigationState {
  canNavigateBack: boolean;
  canNavigateForward: boolean;
}

interface BrowserContextValue extends Omit<BrowserContextProps, 'initialUrl'> {
  url: string | null;
  cleanUrl: string | null;
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
  shouldDisplayWebView: boolean;
  setShouldDisplayWebView: React.Dispatch<React.SetStateAction<boolean>>;
  
  navigationState: NavigationState;
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
  
  loadingPercentage: SharedValue<number>;
  isLoading: boolean;
  onLoadStart: () => void;
  onLoadProgress: (event: WebViewProgressEvent) => void;
  onLoadError: () => void;
  onLoadEnd: (event: NativeSyntheticEvent<WebViewErrorEvent | WebViewNavigationEvent>) => void;
  
  error: boolean;
  resetError: () => void;
}

const BrowserContext = React.createContext<BrowserContextValue | undefined>(undefined);

export const BrowserContextProvider: React.FC<PropsWithChildren<BrowserContextProps>> = ({ children, initialUrl, ...value }) => {
  const [url, setUrl] = useState(initialUrl ? getHttpsUrlOrGoogleSearchUrl(initialUrl) : null);

  
  const [shouldDisplayWebView, setShouldDisplayWebView] = useState(true);

  const cleanUrl = url ? new URL(url).hostname : null;

  const [navigationState, setNavigationState] = useState({
    canNavigateBack: false,
    canNavigateForward: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadingPercentage = useSharedValue(0);

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.loading) {
      if (Platform.OS === 'android' && error) {
        setShouldDisplayWebView(false);
      }
      return;
    }

    setUrl(navState.url);
    setNavigationState({
      canNavigateBack: navState.canGoBack,
      canNavigateForward: navState.canGoForward,
    });
  };

  const onLoadStart = () => {
    if (isLoading) {
      return;
    }

    loadingPercentage.value = 0.05;

    setIsLoading(true);
  };

  const onLoadProgress = (event: WebViewProgressEvent) => {
    const { progress } = event.nativeEvent;
    loadingPercentage.value = progress;

    
    if (progress === 1) {
      setShouldDisplayWebView(true);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const resetError = () => setError(false);

  const onLoadEnd = (event: NativeSyntheticEvent<WebViewErrorEvent | WebViewNavigationEvent>) => {
    const { nativeEvent } = event;

    if (!eventIsErrorEvent(nativeEvent) && nativeEvent.title.toLowerCase() !== 'webpage not available') {
      resetError();
    }
  };

  const onLoadError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <BrowserContext.Provider
      value={{
        ...value,
        url,
        cleanUrl,
        navigationState,
        shouldDisplayWebView,
        setShouldDisplayWebView,
        setUrl,
        setNavigationState,
        onNavigationStateChange,
        error,
        loadingPercentage,
        isLoading,
        onLoadStart,
        onLoadProgress,
        onLoadEnd,
        onLoadError,
        resetError,
      }}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowserContext = (): BrowserContextValue => {
  const context = useContext(BrowserContext);

  if (!context) {
    throw new Error('BrowserContext not initialized');
  }

  return context;
};

function eventIsErrorEvent(event: WebViewErrorEvent | WebViewNavigationEvent): event is WebViewErrorEvent {
  return 'code' in event;
}
