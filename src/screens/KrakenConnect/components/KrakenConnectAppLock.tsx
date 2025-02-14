import { SecurityLevel } from 'expo-local-authentication';
import { forwardRef, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { Label } from '@/components/Label/Label';

import { MissingBiometricsSheet } from '@/components/MissingBiometricsSheet';
import { useAuthType } from '@/hooks/useAuthType';

import { SECURITY_ENROLLED_NONE, enableBiometrics } from '/helpers/biometric-unlock';
import loc from '/loc';

interface Props {
  onSucceed: () => void;
}

export const KrakenConnectAppLock = forwardRef<BottomSheetModalRef, Props>(({ onSucceed }, ref) => {
  const { authType, supportedAuth } = useAuthType();
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);

  const onSecurePress = async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      if (await enableBiometrics()) {
        onSucceed();
      } else {
        throw new Error('Failed to enable AppLock');
      }
    } catch (e) {
      if (e instanceof Error && e.message === SECURITY_ENROLLED_NONE) {
        bottomSheetModalRef.current?.present();
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet snapPoints={['100%']} ref={ref} index={-1}>
      <View style={styles.body}>
        <View>
          <Image style={styles.image} source={require('@/assets/images/krakenConnect/Account_activated.png')} />
          <Label style={styles.labelContainer} type="boldDisplay2">
            {loc.krakenConnect.appLock.title}
          </Label>
          <Label style={styles.labelContainer} type="regularBody">
            {loc.formatString(loc.krakenConnect.appLock.description, { authType: authType })}
          </Label>
        </View>

        <FloatingBottomContainer style={styles.buttons}>
          <Button
            size="large"
            color="kraken"
            text={loc.onboarding_secure_wallet.secureWallet}
            loading={isLoading}
            disabled={isLoading}
            onPress={onSecurePress}
          />
        </FloatingBottomContainer>
      </View>
      {supportedAuth?.securityLevelEnrolled === SecurityLevel.NONE && (
        <MissingBiometricsSheet ref={bottomSheetModalRef} authenticationTypes={supportedAuth?.authenticationTypes ?? []} />
      )}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
