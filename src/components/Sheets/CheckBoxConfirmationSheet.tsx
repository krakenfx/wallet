import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';
import { CheckBox } from '@/components/CheckBox';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';

import { ButtonProps } from '../Button';

type Props = {
  title: string;
  testID?: string;
  checkBoxLabels: string[];
  cancelButtonProps: ButtonProps;
  confirmButtonProps: ButtonProps;
};

export const CheckBoxConfirmationSheet = forwardRef<BottomSheetModalRef, Props>(
  ({ title, checkBoxLabels, testID, cancelButtonProps, confirmButtonProps }, ref) => {
    const [checks, setChecks] = useState<boolean[]>(Array(checkBoxLabels.length).fill(false));

    const reset = () => {
      setChecks(Array(checkBoxLabels.length).fill(false));
    };

    const toggleCheck = (index: number) => {
      setChecks(prevChecks => {
        const newChecks = [...prevChecks];
        newChecks[index] = !newChecks[index];
        return newChecks;
      });
    };

    const allChecked = checks.every(check => check);

    return (
      <BottomSheetModal onChange={reset} dismissible={false} enableDynamicSizing index={0} ref={ref}>
        <BottomSheetView testID={testID}>
          <View style={styles.container}>
            <Label type="boldDisplay3" style={styles.title}>
              {title}
            </Label>
            {checkBoxLabels.map((label, index) => (
              <CheckBox key={index} testID={`ConfirmationCheck-${index}`} onPress={() => toggleCheck(index)} checked={checks[index]} title={label} />
            ))}
          </View>
          <FloatingBottomButtons
            noAbsolutePosition
            primary={{
              disabled: !allChecked,
              ...confirmButtonProps,
            }}
            secondary={cancelButtonProps}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
});
