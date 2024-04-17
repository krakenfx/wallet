import React, { forwardRef } from 'react';

import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';

import { BlockScreenContent, BlockScreenProps } from './BlockScreenContent';

export const BlockScreenModal = forwardRef<BottomSheetModalRef, BlockScreenProps>((props, ref) => {
  return (
    <BottomSheetModal ref={ref} snapPoints={['100%']} onDismiss={props.onGoBack} isWarning>
      <BlockScreenContent {...props} />
    </BottomSheetModal>
  );
});
