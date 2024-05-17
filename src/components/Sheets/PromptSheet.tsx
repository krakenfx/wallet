import { useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';

import { BottomSheet, BottomSheetRef } from '@/components/BottomSheet';

type Props = {
  Prompt: React.FC<{ onLayout: ReturnType<typeof useBottomSheetDynamicSnapPoints>['handleContentLayout'] }>;
  sheetRef: React.RefObject<BottomSheetRef>;
};

export const PromptSheet: React.FC<Props> = ({ Prompt, sheetRef }) => {
  const navigation = useNavigation();
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <BottomSheet
      ref={sheetRef}
      animateOnMount
      onClose={navigation.goBack}
      contentHeight={animatedContentHeight}
      handleHeight={animatedHandleHeight}
      snapPoints={animatedSnapPoints}>
      <Prompt onLayout={handleContentLayout} />
    </BottomSheet>
  );
};
