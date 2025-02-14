import { useRef } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';

import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { Label } from '@/components/Label/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useHasKrakenConnectCredentials } from '@/realm/krakenConnect/useHasKrakenConnectCredentials';
import { useKrakenConnectMutations } from '@/realm/krakenConnect/useKrakenConnectMutation';
import { type NavigationProps, Routes } from '@/Routes';

import { navigationStyle } from '@/utils/navigationStyle';

import { KrakenAccountInstructions } from './components/KrakenAccountInstructions';
import { KrakenConnectAppLock } from './components/KrakenConnectAppLock';
import { KrakenConnectWalletAlert } from './components/KrakenConnectWalletAlert';
import { useAccountNumberFromRoute } from './hooks/useAccountNumberFromRoute';
import { createKrakenConnectOauth } from './utils/createKrakenConnectOauth';

import { isBiometricEnabled } from '/helpers/biometric-unlock';
import loc from '/loc';

export const KrakenConnectLandingScreen = ({ navigation, route }: NavigationProps<'KrakenConnectLanding'>) => {
  const accountNumber = useAccountNumberFromRoute(route);
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const appLockSheetRef = useRef<BottomSheetModalRef>(null);
  const { saveOauthVerification } = useKrakenConnectMutations();
  const hasCredentials = useHasKrakenConnectCredentials();

  const openPanel = () => {
    bottomSheetModalRef.current?.expand();
  };

  const connectToKraken = () => {
    if (hasCredentials) {
      close();
      navigation.replace(Routes.KrakenConnectConnected, { selectedAccountNumber: accountNumber });
    } else {
      const { oathLink, verification, challenge } = createKrakenConnectOauth(accountNumber);
      saveOauthVerification(challenge, verification);
      Linking.openURL(oathLink);
      close();
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

  return (
    <View style={styles.flex}>
      <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
        <View style={styles.body}>
          <View>
            <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.webp')} />
            <Label style={styles.labelContainer} type="boldDisplay2">
              {loc.krakenConnect.unconnected.title}
            </Label>
            <Label style={styles.labelContainer} type="regularBody">
              {loc.krakenConnect.unconnected.body}
            </Label>
          </View>

          <FloatingBottomContainer style={styles.buttons}>
            <KrakenConnectWalletAlert message={loc.krakenConnect.unconnected.alert} accountNumber={accountNumber} />
            <Button size="large" icon="kraken" color="kraken" text={loc.krakenConnect.unconnected.cta} onPress={checkAppLockAndConnectToKraken} />
            <Button size="large" text={loc.krakenConnect.unconnected.noAccount} onPress={openPanel} />
          </FloatingBottomContainer>
        </View>
      </BottomSheet>
      <KrakenAccountInstructions connectToKraken={checkAppLockAndConnectToKraken} ref={bottomSheetModalRef} />
      <KrakenConnectAppLock ref={appLockSheetRef} onSucceed={checkAppLockAndConnectToKraken} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  image: {
    alignSelf: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttons: {
    marginHorizontal: 16,
    gap: 16,
  },
  labelContainer: {
    marginBottom: 16,
  },
});

KrakenConnectLandingScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
