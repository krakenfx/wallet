import type { PropsWithChildren } from 'react';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { BottomSheet, type BottomSheetRef } from '@/components/BottomSheet';

export const PromptSheet = React.forwardRef<BottomSheetRef, PropsWithChildren>(({ children }, ref) => {
  const navigation = useNavigation();

  return (
    <BottomSheet ref={ref} animateOnMount enableDynamicSizing onClose={navigation.goBack}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheet>
  );
});
