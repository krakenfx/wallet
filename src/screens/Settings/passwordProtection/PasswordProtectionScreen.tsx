import { useRef } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { CardWarning } from '@/components/CardWarning';
import { GradientScreenView } from '@/components/Gradients';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsCheckItem, SettingsCheckItemsBox, SettingsInfoBox, SettingsSwitch } from '../components';

import { usePasswordProtectionEnabled } from './hooks';
import { PasswordChangeInfoSheet } from './PasswordChangeInfoSheet';

import type { SettingsNavigationProps } from '../SettingsRouter';

import { biometricUnlock, isBiometricEnabled } from '/helpers/biometric-unlock';
import loc from '/loc';

const BIOMETRIC_DELAY = 800;

export const PasswordProtectionScreen = ({ navigation }: SettingsNavigationProps<'PasswordProtection'>) => {
  const { navigate } = navigation;
  const insets = useSafeAreaInsets();
  const passwordChangeInfoSheet = useRef<BottomSheetModalRef>(null);

  useHeaderTitle(loc.passwordProtection.title);

  const { storageEncrypted, seedEncrypted, encryptionEnabled } = usePasswordProtectionEnabled();

  const showInfoSheet = () => {
    passwordChangeInfoSheet.current?.present();
  };

  const onToggle = async (enable: boolean) => {
    if (await biometricUnlock()) {
      if (enable) {
        navigate(Routes.PasswordProtectionForm);
      } else {
        const delay = (await isBiometricEnabled()) ? BIOMETRIC_DELAY : 0;

        setTimeout(() => navigate(Routes.DisablePasswordProtection), delay);
      }
    } else {
      throw new Error('Failed to unlock');
    }
  };

  const seedEncryptionItemProps = {
    enabled: seedEncrypted,
    onPress: encryptionEnabled && !seedEncrypted ? showInfoSheet : undefined,
  };

  return (
    <GradientScreenView>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <SettingsSwitch
          testID="PasswordProtection"
          text={loc.passwordProtection.enablePasswordProtection}
          icon="lock"
          enabled={encryptionEnabled}
          onToggle={onToggle}
        />
        <SettingsInfoBox
          text={seedEncrypted ? loc.passwordProtection.protectYourData : loc.passwordProtection.whatIsDescription}
          boldText={seedEncrypted ? undefined : loc.passwordProtection.whatIs}
        />
        <SettingsCheckItemsBox>
          <SettingsCheckItem name={loc.passwordProtection.sendCrypto} {...seedEncryptionItemProps} />
          <SettingsCheckItem name={loc.passwordProtection.viewPhrase} {...seedEncryptionItemProps} />
          <SettingsCheckItem name={loc.passwordProtection.signTransactions} {...seedEncryptionItemProps} />
          <SettingsCheckItem name={loc.passwordProtection.connectedApps} {...seedEncryptionItemProps} />
          <SettingsCheckItem
            name={loc.passwordProtection.openApp}
            enabled={storageEncrypted}
            onPress={encryptionEnabled && !storageEncrypted ? showInfoSheet : undefined}
          />
        </SettingsCheckItemsBox>
        {!seedEncrypted && (
          <View style={styles.card}>
            <CardWarning
              title={loc.passwordProtection.passwordSupersedesAppLock}
              description={loc
                .formatString(loc.passwordProtection.passwordSupersedesAppLockDescription, {
                  biometricDescription: Platform.select({
                    ios: loc.passwordProtection.biometricDescriptionIOS,
                    default: loc.passwordProtection.biometricDescriptionAndroid,
                  }),
                })
                .toString()}
              type="normal"
            />
          </View>
        )}
      </ScrollView>
      <PasswordChangeInfoSheet
        onConfirm={() => {
          passwordChangeInfoSheet.current?.close();
        }}
        ref={passwordChangeInfoSheet}
      />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  card: {
    marginTop: 24,
  },
});

PasswordProtectionScreen.navigationOptions = navigationStyle({ title: loc.passwordProtection.title, headerTransparent: true });
