import React, { forwardRef } from 'react';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';

import { BlockScreenContent } from './BlockScreenContent';

import type { BlockScreenProps } from './BlockScreenContent';

export const BlockScreenModal = forwardRef<BottomSheetModalRef, BlockScreenProps>((props, ref) => {
  return (
    <BottomSheetModal ref={ref} snapPoints={['100%']} onDismiss={props.onGoBack} isWarning>
      <BlockScreenContent {...props} />
    </BottomSheetModal>
  );
});
