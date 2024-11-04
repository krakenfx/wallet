import React, { forwardRef } from 'react';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { CheckBoxConfirmationSheet } from '@/components/Sheets';

import loc from '/loc';

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export const SkipWarningSheet = forwardRef<BottomSheetModalRef, Props>(({ onCancel, onConfirm }, ref) => {
  return (
    <CheckBoxConfirmationSheet
      testID="SkipBackupWarning"
      ref={ref}
      title={loc.onboarding_backup_prompt.skipWarning.title}
      checkBoxLabels={[loc.onboarding_backup_prompt.skipWarning.checkOne, loc.onboarding_backup_prompt.skipWarning.checkTwo]}
      confirmButtonProps={{
        text: loc.onboarding_backup_prompt.skipWarning.confirm,
        onPress: onConfirm,
        testID: 'SkipBackupWarningConfirmButton',
      }}
      cancelButtonProps={{
        text: loc.onboarding_backup_prompt.skipWarning.back,
        onPress: onCancel,
        testID: 'SkipBackupWarningBackButton',
      }}
    />
  );
});
