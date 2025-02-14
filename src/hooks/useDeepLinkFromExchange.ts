import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

import { Linking } from 'react-native';

import { Routes } from '@/Routes';

export const useDeepLinkFromExchange = () => {
  const navigation = useNavigation();
  const handleURL = useCallback(
    (url: string) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      if (parsedUrl?.hostname === 'krakenconnect') {
        const code = params.get('code');
        const state = params.get('state');
        const connectionError = params.get('error');
        navigation.navigate(Routes.KrakenConnectConnected, {
          code,
          state,
          connectionError,
        });
      }
    },
    [navigation],
  );
  useEffect(() => {
    const listener = Linking.addEventListener('url', (event: { url: string }) => {
      const url = event.url;
      handleURL(url);
    });
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleURL(initialUrl);
      }
    };
    handleInitialURL();
    return () => {
      listener.remove();
    };
  }, [handleURL]);
};
