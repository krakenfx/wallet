import { useFocusEffect } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';

import { Linking, StyleSheet, View } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import type { ApiKeyResponse } from '@/api/krakenConnect/base/fetchFastApiKeys';
import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useKrakenConnectFastApiKeyQuery } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectFastApiKeyQuery';
import { useHasKrakenConnectCredentials } from '@/realm/krakenConnect/useHasKrakenConnectCredentials';
import { useIsConnectedWithExchange } from '@/realm/krakenConnect/useIsConnectedWithExchange';
import { useKrakenConnectMutations } from '@/realm/krakenConnect/useKrakenConnectMutation';
import { useKrakenConnectSettingsMutations } from '@/realm/krakenConnect/useKrakenConnectSettingsMutations';
import { type NavigationProps, Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { KrakenAccountInstructions } from './components/KrakenAccountInstructions';
import { KrakenConnectAppLock } from './components/KrakenConnectAppLock';
import { KrakenConnectConnected } from './components/KrakenConnectConnected';
import { KrakenConnectFetchingCredentials } from './components/KrakenConnectFetchingCredentials';
import { KrakenConnectFetchingError } from './components/KrakenConnectFetchingError';
import { KrakenConnectLanding } from './components/KrakenConnectLanding';
import { useAccountNumberFromRoute } from './hooks/useAccountNumberFromRoute';

import { createKrakenConnectOauth } from './utils/createKrakenConnectOauth';

import { getKrakenConnectScreenContent } from './utils/getKrakenConnectScreenContent';

import type { KarkenConnectScreenType } from './types';

import { isBiometricEnabled } from '/helpers/biometric-unlock';

export const KarkenConnectScreen = ({ navigation, route }: NavigationProps<'KrakenConnect'>) => {
  const [accountNumber, setAccountNumber] = useState<number>(useAccountNumberFromRoute(route));
  const hasCredentials = useHasKrakenConnectCredentials();
  const { params = {} } = route;
  const { code = null, state = null, connectionError = null } = params;
  const accountInstructionsSheetRef = useRef<BottomSheetModalRef>(null);
  const appLockSheetRef = useRef<BottomSheetModalRef>(null);
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { saveExchangeCredentials, saveOauthVerification, deleteOauthVerification } = useKrakenConnectMutations();
  const { setExchangeConnectForAccount } = useKrakenConnectSettingsMutations();
  const { isLoading, isFetching, isError, isSuccess, isFetched, error, data = {} } = useKrakenConnectFastApiKeyQuery(!hasCredentials, code, state);
  const isConnected = useIsConnectedWithExchange(accountNumber);
  const [previousError, setPreviousError] = useState(error);
  const screenType: KarkenConnectScreenType = getKrakenConnectScreenContent({
    isFetching,
    isLoading,
    isError,
    hasCredentials,
    isConnected,
    connectionError,
    error: previousError,
  });

  const openPanel = () => {
    accountInstructionsSheetRef.current?.expand();
  };

  const connectToKraken = () => {
    appLockSheetRef.current?.forceClose();
    accountInstructionsSheetRef.current?.forceClose();
    if (hasCredentials) {
      setExchangeConnectForAccount(accountNumber);
    } else {
      const { oathLink, verification, challenge } = createKrakenConnectOauth(accountNumber);
      saveOauthVerification(challenge, verification);
      Linking.openURL(oathLink);
    }
  };

  const checkAppLockAndConnectToKraken = async () => {
    const isAppLockEnabled = await isBiometricEnabled();
    if (isAppLockEnabled) {
      connectToKraken();
    } else {
      appLockSheetRef.current?.expand();
    }
  };

  const onTransferPress = () => {
    close();
    navigation.replace(Routes.KrakenConnectTransfer);
  };

  useEffect(() => {
    const { api_key = '', secret = '' } = data as ApiKeyResponse;
    if (api_key && secret) {
      setExchangeConnectForAccount(accountNumber);
      saveExchangeCredentials(api_key, secret);
    }
  }, [data, accountNumber, saveExchangeCredentials, setExchangeConnectForAccount]);

  useEffect(() => {
    if (isError || isSuccess || isFetched) {
      deleteOauthVerification();
    }
  }, [isError, isSuccess, isFetched, deleteOauthVerification]);

  useEffect(() => {
    if (state) {
      const [_, account] = decodeURIComponent(state).split(',');
      setAccountNumber(Number(account));
    }
  }, [state]);

  useEffect(() => {
    if (error) {
      setPreviousError(error);
    }
    if (!error && isSuccess && hasCredentials) {
      setPreviousError(null);
    }
  }, [error, isSuccess, hasCredentials]);

  useFocusEffect(() => {
    bottomSheetProps.ref.current?.expand();
  });

  const renderScreenContent = (screen: KarkenConnectScreenType) => {
    switch (screen) {
      case 'connected':
        return <KrakenConnectConnected accountNumber={accountNumber} onTransferPress={onTransferPress} />;
      case 'loading':
        return <KrakenConnectFetchingCredentials />;
      case 'error':
        return <KrakenConnectFetchingError />;
      case 'landing':
      default:
        return <KrakenConnectLanding accountNumber={accountNumber} noAccount={openPanel} connect={checkAppLockAndConnectToKraken} />;
    }
  };

  return (
    <View style={styles.content}>
      <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
        <Animated.View style={styles.content} entering={FadeIn} key={screenType}>
          {renderScreenContent(screenType)}
        </Animated.View>
      </BottomSheet>
      <KrakenAccountInstructions connectToKraken={checkAppLockAndConnectToKraken} ref={accountInstructionsSheetRef} />
      <KrakenConnectAppLock ref={appLockSheetRef} onSucceed={checkAppLockAndConnectToKraken} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

KarkenConnectScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
