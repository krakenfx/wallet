import { useRef, useState } from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';

import { FeatureFlag, useFeatureFlagEnabled } from '@/utils/featureFlags';
import { navigationStyle } from '@/utils/navigationStyle';
import { runAfterUISync } from '@/utils/runAfterUISync';
import { useIsOnline } from '@/utils/useConnectionManager';

import { useImportWallet } from '../Onboarding/hooks/useImportWallet';

import { CloudBackupErrorSheet } from './components/CloudBackupErrorSheet';

import { CloudBackupSuccessSheet } from './components/CloudBackupSuccessSheet';

import type { PasskeyErrorType } from './components/CloudBackupErrorSheet';
import type { CloudBackupSuccessSheetRef } from './components/CloudBackupSuccessSheet';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { CLOUD_BACKUP_DELETED, CloudBackupError, CloudBackupManager } from '/modules/cloud-backup';

export const WalletCloudImportScreen = ({ navigation, route }: NavigationProps<'OnboardingWalletCloudImport'>) => {
  const { setCloudBackupCompleted } = useWalletBackupSettings();
  const { importWallet } = useImportWallet();
  const [hasReadData, setHasReadData] = useState(false);
  const [passkeyError, setPasskeyError] = useState<PasskeyErrorType>();
  const isOnline = useIsOnline();
  const isOnboardingImportDiscoveryEnabled = useFeatureFlagEnabled(FeatureFlag.onboardingImportDiscoveryEnabled);

  const successSheetRef = useRef<CloudBackupSuccessSheetRef>(null);

  const readPasskey = async () => {
    try {
      const credentialID = route.params?.selectedBackup.credentialID ?? null;
      const response = await CloudBackupManager.readData(credentialID);
      if (!response.data) {
        throw Error('No recovery phrase found');
      }
      if (response.data === CLOUD_BACKUP_DELETED) {
        setPasskeyError('passkeyErrorInactive');
        return;
      }
      setHasReadData(true);
      const importCompleted = await runAfterUISync(() => importWallet(response.data));
      if (!importCompleted) {
        throw Error('Failed to import phrase');
      }
      setCloudBackupCompleted(response.credentialID);
      navigation.replace(isOnboardingImportDiscoveryEnabled && isOnline ? Routes.OnboardingImportSubWallets : Routes.OnboardingSecureWallet);
    } catch (e) {
      setHasReadData(false);
      if (e instanceof Error && e.code === CloudBackupError.user_canceled) {
        navigation.goBack();
      } else {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        setPasskeyError('passkeyErrorReading');
      }
    }
  };

  const clearError = () => setPasskeyError(undefined);

  return (
    <GradientScreenView>
      <Image style={styles.image} source={require('./images/PasskeyIllustration.png')} />
      <View style={styles.titleContainer}>
        <Label type="boldDisplay4">{loc.onboardingImportCloudBackup.title}</Label>
        <Label type="regularBody" color="light75">
          {loc.onboardingImportCloudBackup.desc}
        </Label>
      </View>
      <View style={styles.container}>
        <Button
          disabled={hasReadData}
          icon="passkey"
          text={loc.onboardingImportCloudBackup.usePasskey}
          size="large"
          color="light100"
          textColor="dark100"
          iconColor="dark100"
          onPress={readPasskey}
        />
      </View>
      <CloudBackupSuccessSheet ref={successSheetRef} />
      {!!passkeyError && <CloudBackupErrorSheet type={passkeyError} onClose={clearError} />}
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  titleContainer: {
    marginHorizontal: 16,
    padding: 12,
    gap: 8,
  },
  container: {
    padding: 16,
    margin: 12,
    borderRadius: 34,
    overflow: 'hidden',
  },
});

WalletCloudImportScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  title: '',
});
