import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';

import loc from '/loc';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteBackupConfirmModalSheet = React.forwardRef<BottomSheetModalRef, Props>(({ onCancel, onConfirm }, ref) => {
  return (
    <BottomSheetModal ref={ref} snapPoints={['100%']}>
      <ModalNavigationHeader title={loc.walletCloudBackupError.deleteBackupConfirmation.header} onClosePress={onCancel} />
      <View>
        <View style={styles.headerContainer}>
          <Label type="boldDisplay4" style={styles.label}>
            {loc.walletCloudBackupError.deleteBackupConfirmation.title}
          </Label>
          <Label type="regularTitle1" color="light75">
            {loc.walletCloudBackupError.deleteBackupConfirmation.description}
          </Label>
        </View>
      </View>
      <FloatingBottomButtons
        primary={{
          text: loc.walletCloudBackupError.deleteBackupConfirmation.remove,
          onPress: onConfirm,
          color: 'red400',
        }}
        secondary={{
          text: loc.walletCloudBackupError.deleteBackupConfirmation.cancel,
          onPress: onCancel,
        }}
      />
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 24,
  },
  label: {
    marginBottom: 12,
  },
});
