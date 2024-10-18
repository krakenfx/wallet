import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet, BottomSheetModalRef } from '@/components/BottomSheet';
import { CheckBox } from '@/components/CheckBox';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { CloudBackupErrorSheet, PasskeyErrorType } from './components/CloudBackupErrorSheet';

import { DeleteBackupConfirmModalSheet } from './components/DeleteBackupConfirmModalSheet';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { CLOUD_BACKUP_DELETED, CloudBackupError, CloudBackupManager } from '/modules/cloud-backup';

export const WalletCloudBackupDeleteScreen = ({ navigation }: NavigationProps<'SettingsWalletCloudBackupDelete'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const [passkeyError, setPasskeyError] = useState<PasskeyErrorType>();
  const confirmModalSheet = useRef<BottomSheetModalRef>(null);

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
        throw new Error('Missing credentialID');
      }
      await CloudBackupManager.writeData(credentialID, CLOUD_BACKUP_DELETED);
      await deleteMetadata();
    } catch (e) {
      if (e instanceof Error && e.code !== CloudBackupError.user_canceled) {
        setPasskeyError('passkeyErrorDeleting');
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    }
  };

  const deleteMetadata = async () => {
    try {
      if (!credentialID) {
        throw new Error('Missing credentialID');
      }
      const backups = await CloudBackupManager.getKnownBackups();
      await CloudBackupManager.setKnownBackups(backups.filter(b => b.credentialID !== credentialID));
    } catch (e) {
      if (e instanceof Error && e.code !== CloudBackupError.synchronization_failed) {
        throw e;
      }
    }
    removeCloudBackup();
    close();
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
        <FloatingBottomButtons
          primary={{
            disabled: !allChecked,
            text: loc.walletCloudBackupDelete.delete,
            onPress: onConfirm,
            color: 'red400',
          }}
          secondary={{
            text: loc.walletCloudBackupDelete.cancel,
            onPress: close,
          }}
        />
      </BottomSheet>
      {!!passkeyError && (
        <CloudBackupErrorSheet
          type={passkeyError}
          onClose={clearError}
          onRetry={() => {
            confirmModalSheet.current?.present();
            close();
          }}
        />
      )}
      <DeleteBackupConfirmModalSheet
        ref={confirmModalSheet}
        onCancel={() => {
          confirmModalSheet.current?.close();
        }}
        onConfirm={() => {
          confirmModalSheet.current?.close();
          deleteMetadata();
        }}
      />
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
  headerContainer: {
    marginHorizontal: 24,
  },
  label: {
    marginBottom: 12,
  },
});
