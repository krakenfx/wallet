import React, { useRef, useState } from 'react';

import { Image, StyleSheet, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import { Button } from '@/components/Button';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { IconName, SvgIcon } from '@/components/SvgIcon';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { useLanguage } from '@/realm/settings';
import { NavigationProps, Routes } from '@/Routes';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { navigationStyle } from '@/utils/navigationStyle';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { CloudBackupErrorSheet, PasskeyErrorType } from './components/CloudBackupErrorSheet';
import { CloudBackupSuccessSheet, CloudBackupSuccessSheetRef } from './components/CloudBackupSuccessSheet';

import { getBackupName } from './utils/getBackupName';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { getDateLocale } from '/loc/date';
import { CloudBackupError, CloudBackupManager, CloudBackupMetadata } from '/modules/cloud-backup';

type PendingBackup = {
  credentialID: string;
  backupDate: Date;
  backupName: string;
};

export const WalletCloudBackupScreen = ({ navigation, route }: NavigationProps<'SettingsWalletCloudBackup' | 'OnboardingWalletCloudBackup'>) => {
  const { isManualBackupCompleted, isCloudBackupCompleted, setCloudBackupCompleted } = useWalletBackupSettings();
  const { getMnemonic } = useSecuredKeychain();
  const [passkeyError, setPasskeyError] = useState<PasskeyErrorType>();
  const [pendingBackup, setPendingBackup] = useState<PendingBackup>();

  const language = useLanguage();

  const successSheetRef = useRef<CloudBackupSuccessSheetRef>(null);

  const saveBackupMetadata = async (metadata: CloudBackupMetadata) => {
    try {
      await CloudBackupManager.addKnownBackup(metadata);
    } catch (e) {
      if (e instanceof Error && e.code !== CloudBackupError.synchronization_failed) {
        throw e;
      }
    }
  };

  const writePasskeyData = async ({ credentialID, backupDate, backupName }: PendingBackup) => {
    try {
      const mnemonic = await getMnemonic(true);
      await CloudBackupManager.writeData(credentialID, mnemonic);
    } catch (e) {
      if (e instanceof Error) {
        switch (e.code) {
          case CloudBackupError.no_credentials_found: {
            
            setPasskeyError('passkeyErrorWritingWrongDevice');
            return;
          }
          case CloudBackupError.user_canceled: {
            setPasskeyError('passkeyErrorUserCanceledRegistration');
            return;
          }
        }
      }
      throw e;
    }
    const deviceName = DeviceInfo.getModel() || DeviceInfo.getDeviceNameSync();
    const backup: CloudBackupMetadata = {
      credentialID,
      device: deviceName,
      name: backupName,
      date: backupDate,
    };
    saveBackupMetadata(backup);
    setCloudBackupCompleted(credentialID);
    runAfterUISync(() => {
      hapticFeedback.notificationSuccess();
      successSheetRef.current?.present(() => {
        successSheetRef.current?.close();
        if (route.params?.origin === Routes.OnboardingBackupPrompt) {
          navigation.navigate(isManualBackupCompleted ? Routes.OnboardingSecureWallet : Routes.OnboardingBackupPrompt);
        } else {
          navigation.goBack();
        }
      });
    });
  };

  const createPasskey = async () => {
    try {
      const backupDate = new Date();
      const backupName = getBackupName(backupDate, getDateLocale(language));
      const result = await CloudBackupManager.register(backupName);
      const newPendingBackup: PendingBackup = {
        credentialID: result.credentialID,
        backupDate,
        backupName,
      };
      setPendingBackup(newPendingBackup);
      await writePasskeyData(newPendingBackup);
    } catch (e) {
      if (e instanceof Error && e.code === CloudBackupError.user_canceled) {
        navigation.goBack();
      } else {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
        setPasskeyError('passkeyErrorWriting');
      }
    }
  };

  const clearError = () => setPasskeyError(undefined);

  const runBackupFlow = () => {
    clearError();
    if (pendingBackup) {
      writePasskeyData(pendingBackup);
    } else {
      createPasskey();
    }
  };

  const renderDescriptionItem = (icon: IconName, text: string) => (
    <View style={styles.descriptionItem}>
      <SvgIcon name={icon} size={16} color="light75" />
      <Label type="regularCaption1" color="light75">
        {text}
      </Label>
    </View>
  );

  return (
    <GradientScreenView>
      <Image style={styles.image} source={require('./images/PasskeyIllustration.png')} />
      <View style={styles.titleContainer}>
        <Label type="boldDisplay4">{loc.walletCloudBackup.secureYourBackup}</Label>
        <Label type="regularBody" color="light75">
          {loc.walletCloudBackup.passkeyDescription}
        </Label>
      </View>
      <View style={styles.container}>
        <GradientItemBackground />
        <Button
          disabled={isCloudBackupCompleted}
          icon="passkey"
          text={loc.walletCloudBackup.createPasskey}
          size="large"
          color="light100"
          textColor="dark100"
          iconColor="dark100"
          onPress={runBackupFlow}
        />
        <View style={styles.description}>
          {renderDescriptionItem('shield-tick', loc.walletCloudBackup.hints.part1)}
          {renderDescriptionItem('lock', loc.walletCloudBackup.hints.part2)}
          {renderDescriptionItem('key', loc.walletCloudBackup.hints.part3)}
        </View>
      </View>
      <CloudBackupSuccessSheet ref={successSheetRef} />
      {!!passkeyError && <CloudBackupErrorSheet type={passkeyError} onClose={clearError} onRetry={runBackupFlow} />}
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
  description: {
    marginTop: 16,
    marginBottom: 8,
    gap: 12,
    marginHorizontal: 6,
    opacity: 0.7,
  },
  descriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

WalletCloudBackupScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  title: '',
});
