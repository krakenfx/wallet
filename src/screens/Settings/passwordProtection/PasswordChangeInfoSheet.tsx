import { useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { forwardRef, useMemo } from 'react';
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
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <BottomSheetModal contentHeight={animatedContentHeight} handleHeight={animatedHandleHeight} snapPoints={animatedSnapPoints} ref={ref}>
      <View onLayout={handleContentLayout} testID="PasswordChangeInfoModal">
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
      </View>
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
