import { BottomSheetView } from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetModal } from '@/components/BottomSheet';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { Label } from '@/components/Label';

import loc from '/loc';

export type CloudBackupSuccessSheetRef = {
  present: (callback: () => void) => void;
  close: () => void;
};

export const CloudBackupSuccessSheet = forwardRef<CloudBackupSuccessSheetRef>((_, ref) => {
  const successSheetRef = useRef<BottomSheetModalRef>(null);
  const lottieRef = useRef<LottieView>(null);

  useImperativeHandle(
    ref,
    () => ({
      present: (callback: () => void) => {
        successSheetRef.current?.present();
        setTimeout(callback, 2000);
      },
      close: () => successSheetRef.current?.close(),
    }),
    [],
  );

  return (
    <BottomSheetModal dismissible={false} snapPoints={['50%']} ref={successSheetRef}>
      <BottomSheetView testID="CloudBackupSuccessSheet">
        <View style={[styles.container]}>
          <LottieView ref={lottieRef} style={styles.icon} source={require('@/assets/lottie/successCheckmark.json')} autoPlay loop={false} />
          <Label style={styles.label} type="boldDisplay4">
            {loc.walletCloudBackup.success}
          </Label>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    width: 100,
    height: 100,
  },
  label: {
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
