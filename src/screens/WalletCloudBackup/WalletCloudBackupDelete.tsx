import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { CheckBox } from '@/components/CheckBox';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { CloudBackupErrorSheet, PasskeyErrorType } from './CloudBackupErrorSheet';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { CLOUD_BACKUP_DELETED, CloudBackupError, CloudBackupManager } from '/modules/cloud-backup';

export const WalletCloudBackupDeleteScreen = ({ navigation }: NavigationProps<'SettingsWalletCloudBackupDelete'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const [passkeyError, setPasskeyError] = useState<PasskeyErrorType>();

  const [checks, setChecks] = useState<boolean[]>(Array(2).fill(false));

  const toggleCheck = (index: number) => {
    setChecks(prevChecks => {
      const newChecks = [...prevChecks];
      newChecks[index] = !newChecks[index];
      return newChecks;
    });
  };

  const { removeCloudBackup } = useSettingsMutations();

  const credentialID = useSettingsByKey(RealmSettingsKey.cloudBackupCredentialID);
  const onConfirm = async () => {
    try {
      if (!credentialID) {
        throw Error('Missing credentialID');
      }
      await CloudBackupManager.writeData(credentialID, CLOUD_BACKUP_DELETED);
      const backups = await CloudBackupManager.getKnownBackups();
      await CloudBackupManager.setKnownBackups(backups.filter(b => b.credentialID !== credentialID));
      removeCloudBackup();
      close();
    } catch (e) {
      if (e instanceof Error && e.code !== CloudBackupError.user_canceled) {
        setPasskeyError('passkeyErrorDeleting');
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    }
  };

  const allChecked = checks.every(Boolean);

  const clearError = () => setPasskeyError(undefined);

  return (
    <>
      <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
        <ModalNavigationHeader title={loc.walletCloudBackupDelete.title} onClosePress={close} />
        <View>
          <View style={styles.headerContainer}>
            <Label type="boldDisplay4" style={styles.label}>
              {loc.walletCloudBackupDelete.header}
            </Label>
            <Label type="regularTitle1" color="light75" style={styles.label}>
              {loc.walletCloudBackupDelete.caption}
            </Label>
            {[loc.walletCloudBackupDelete.check1, loc.walletCloudBackupDelete.check2].map((label, index) => (
              <CheckBox key={index} testID={`ConfirmationCheck-${index}`} onPress={() => toggleCheck(index)} checked={checks[index]} title={label} />
            ))}
          </View>
        </View>
        <FloatingBottomContainer>
          <View style={styles.buttonContainer}>
            <Button text={loc.walletCloudBackupDelete.cancel} onPress={close} style={styles.cancelButton} size="large" />
            <Button
              disabled={!allChecked}
              text={loc.walletCloudBackupDelete.delete}
              onPress={onConfirm}
              style={styles.deleteButton}
              size="large"
              color="red400"
            />
          </View>
        </FloatingBottomContainer>
      </BottomSheet>
      {!!passkeyError && <CloudBackupErrorSheet type={passkeyError} onClose={clearError} />}
    </>
  );
};

WalletCloudBackupDeleteScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginHorizontal: 24,
  },
  label: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 4,
  },
  cancelButton: {
    flex: 1,
    marginRight: 4,
  },
});
