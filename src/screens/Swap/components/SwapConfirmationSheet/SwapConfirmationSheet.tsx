import React, { type RefObject } from 'react';
import { StyleSheet } from 'react-native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { ExpandableSheet, type ExpandableSheetMethods } from '@/components/Sheets';

import { SwapConfirmationDetails } from '../SwapConfirmationDetails';
import { SwapConfirmationPreview } from '../SwapConfirmationPreview';

import { useSwapContext } from '../SwapContext';

import type { SwapRouteUIData } from '../../types';

import loc from '/loc';

type Props = {
  route: SwapRouteUIData;
  goBack: () => void;
  showExplainer: () => void;
};

export const SwapConfirmationSheet = React.forwardRef<ExpandableSheetMethods, Props>(({ route, goBack, ...props }, ref) => {
  const {
    refreshCountdownProgress,
    refreshFlashStyle,
    loadingState: [isLoading],
    swapAvailableState: [swapAvailable],
  } = useSwapContext();

  return (
    <ExpandableSheet
      isModal
      ref={ref as RefObject<ExpandableSheetMethods>}
      DetailsComponent={<SwapConfirmationDetails route={route} refreshFlashStyle={refreshFlashStyle} isLoading={isLoading} />}
      PreviewComponent={animatedProps => (
        <SwapConfirmationPreview
          refreshFlashStyle={refreshFlashStyle}
          timeoutProgress={refreshCountdownProgress}
          route={route}
          isLoading={isLoading}
          {...props}
          {...animatedProps}
        />
      )}
      FloatingButtonsComponent={
        <FloatingBottomButtons
          style={styles.buttons}
          useBottomInset={false}
          noAbsolutePosition
          primary={{
            text: loc.swap.confirmation.confirm,
            disabled: isLoading || !swapAvailable,
            loading: isLoading,
          }}
          secondary={{
            text: loc.swap.confirmation.cancel,
            onPress: goBack,
          }}
        />
      }
    />
  );
});

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
  },
});
