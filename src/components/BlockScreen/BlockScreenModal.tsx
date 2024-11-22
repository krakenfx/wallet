import { forwardRef, useRef } from 'react';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';

import { BlockScreenContent, type BlockScreenProps } from './BlockScreenContent';

interface BlockScreenModalProps extends BlockScreenProps {
  onDismiss?: () => void;
}

export const BlockScreenModal = forwardRef<BottomSheetModalRef, BlockScreenModalProps>(({ onDismiss, ...props }, ref) => {
  const isActionTriggeredByUser = useRef(false);

  const onGoBack = () => {
    isActionTriggeredByUser.current = true;
    props.onGoBack();
  };

  const onProceed = () => {
    isActionTriggeredByUser.current = true;
    props.onProceed();
  };

  const handleDismiss = () => {
    if (isActionTriggeredByUser.current) {
      isActionTriggeredByUser.current = false;
      return;
    }

    onDismiss?.();
  };

  return (
    <BottomSheetModal ref={ref} snapPoints={['100%']} onDismiss={handleDismiss} isWarning>
      <BlockScreenContent {...props} onGoBack={onGoBack} onProceed={onProceed} />
    </BottomSheetModal>
  );
});
