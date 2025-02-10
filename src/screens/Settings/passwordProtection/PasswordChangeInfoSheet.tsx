import { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  onConfirm: () => void;
};

export const PasswordChangeInfoSheet = forwardRef<BottomSheetModalRef, Props>(({ onConfirm }, ref) => {
  return (
    <BottomSheetModal index={0} enableDynamicSizing ref={ref}>
      <BottomSheetView testID="PasswordChangeInfoModal">
        <View style={styles.container}>
          <Label type="boldDisplay3">{loc.passwordProtection.resetHintModalTitle}</Label>
          <Label type="regularTitle2" color="light75" style={styles.desc}>
            {loc.passwordProtection.resetHintModalDesc}
          </Label>
        </View>
        <FloatingBottomButtons
          noAbsolutePosition
          primary={{
            text: loc.passwordProtection.resetHintModalConfirm,
            onPress: onConfirm,
            testID: 'PasswordChangeInfoModalConfirm',
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  desc: {
    marginTop: 20,
    marginBottom: 12,
  },
  container: {
    padding: 24,
  },
});
