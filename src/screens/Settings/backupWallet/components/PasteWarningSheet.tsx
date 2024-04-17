import { useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';

import { CheckBox } from '@/components/CheckBox';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export const PasteWarningSheet = forwardRef<BottomSheetModalRef, Props>(({ onConfirm, onCancel }, ref) => {
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const [checkOne, setCheckOne] = useState(false);
  const [checkTwo, setCheckTwo] = useState(false);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const reset = () => {
    setCheckOne(false);
    setCheckTwo(false);
  };

  return (
    <BottomSheetModal
      onChange={reset}
      dismissible={false}
      contentHeight={animatedContentHeight}
      handleHeight={animatedHandleHeight}
      snapPoints={animatedSnapPoints}
      ref={ref}>
      <View onLayout={handleContentLayout} testID="PasteWarning">
        <View style={styles.container}>
          <Label type="boldDisplay3">{loc.onboardingBackupVerify.pasteWarning.title}</Label>
          <CheckBox
            testID="PasteWarningCheckOne"
            onPress={() => setCheckOne(c => !c)}
            checked={checkOne}
            title={loc.onboardingBackupVerify.pasteWarning.checkOne}
          />
          <CheckBox
            testID="PasteWarningCheckTwo"
            onPress={() => setCheckTwo(c => !c)}
            checked={checkTwo}
            title={loc.onboardingBackupVerify.pasteWarning.checkTwo}
          />
        </View>
        <FloatingBottomButtons
          noAbsolutePosition
          primary={{
            disabled: !checkOne || !checkTwo,
            text: loc.onboardingBackupVerify.pasteWarning.confirm,
            onPress: onConfirm,
            testID: 'PasteWarningConfirmButton',
          }}
          secondary={{
            text: loc.onboardingBackupVerify.pasteWarning.back,
            onPress: onCancel,
            testID: 'PasteWarningBackButton',
          }}
        />
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
