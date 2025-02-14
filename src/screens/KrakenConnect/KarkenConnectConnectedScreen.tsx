import { useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { ApiKeyResponse } from '@/api/krakenConnect/base/fetchFastApiKeys';
import { BottomSheet } from '@/components/BottomSheet';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useKrakenConnectFastApiKeyQuery } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectFastApiKeyQuery';
import { useHasKrakenConnectCredentials } from '@/realm/krakenConnect/useHasKrakenConnectCredentials';
import { useKrakenConnectMutations } from '@/realm/krakenConnect/useKrakenConnectMutation';
import { useSettingsMutations } from '@/realm/settings/useSettingsMutations';
import { type NavigationProps, Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { KrakenConnectConnected } from './components/KrakenConnectConnected';
import { KrakenConnectFetchingCredentials } from './components/KrakenConnectFetchingCredentials';
import { KrakenConnectFetchingError } from './components/KrakenConnectFetchingError';
import { useAccountNumberFromRoute } from './hooks/useAccountNumberFromRoute';

export const KarkenConnectConnectedScreen = ({ navigation, route }: NavigationProps<'KrakenConnectConnected'>) => {
  const [accountNumber, setAccountNumber] = useState<number>(useAccountNumberFromRoute(route));
  const hasCredentials = useHasKrakenConnectCredentials();
  const { params = {} } = route;
  const { code = null, state = null, connectionError = null } = params;
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { saveExchangeCredentials, deleteOauthVerification } = useKrakenConnectMutations();
  const { setExchangeConnectForAccount } = useSettingsMutations();
  const { isLoading, isPending, isError, isSuccess, isFetched, data = {} } = useKrakenConnectFastApiKeyQuery(!hasCredentials, code, state);
  const fetching = !hasCredentials && (isPending || isLoading);
  const showError = !hasCredentials && (connectionError || isError);

  const onTransferPress = () => {
    close();
    navigation.replace(Routes.KrakenConnectTransfer);
  };

  useEffect(() => {
    const { api_key = '', secret = '' } = data as ApiKeyResponse;
    if (api_key && secret) {
      saveExchangeCredentials(api_key, secret);
    }
  }, [data, saveExchangeCredentials]);

  useEffect(() => {
    if (hasCredentials) {
      setExchangeConnectForAccount(accountNumber);
    }
  }, [accountNumber, hasCredentials, setExchangeConnectForAccount]);

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

  return (
    <View style={styles.content}>
      <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
        <Animated.View style={styles.content} entering={FadeIn} exiting={FadeOut}>
          {hasCredentials && !fetching ? <KrakenConnectConnected accountNumber={accountNumber} onTransferPress={onTransferPress} /> : null}
          {showError ? <KrakenConnectFetchingError /> : null}
          {fetching ? <KrakenConnectFetchingCredentials /> : null}
        </Animated.View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

KarkenConnectConnectedScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
