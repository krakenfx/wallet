import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SwapRouteTXStep } from '@/api/types';
import { BottomSheetModal, type BottomSheetModalRef } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';

import { useTheme } from '@/theme/themes';

import { LoadingBlock } from '../LoadingBlock';
import { RouteTimeoutCircle } from '../RouteTimeoutCircle';
import { useSwapContext } from '../SwapContext';
import { SwapRouteExplainerStep } from '../SwapRouteExplainerStep/SwapRouteExplainerStep';

import loc from '/loc';

type Props = {
  steps: SwapRouteTXStep[];
  onClose: () => void;
};

export const SwapRouteExplainerSheet = forwardRef<BottomSheetModalRef, Props>(({ steps, onClose }, ref) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    refreshCountdownProgress,
    refreshFlashStyle,
    loadingState: [isLoading],
  } = useSwapContext();

  return (
    <BottomSheetModal
      stackBehavior="push"
      ref={ref}
      enableDynamicSizing
      detached={true}
      bottomInset={insets.bottom + 30}
      handleComponent={null}
      style={styles.modal}>
      <BottomSheetScrollView bounces={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Label type="boldTitle0">{loc.swap.routePath.title}</Label>
          {!isLoading && <RouteTimeoutCircle progress={refreshCountdownProgress} />}
        </View>
        {isLoading ? (
          <LoadingBlock backgroundColor="transparent" />
        ) : (
          <Animated.View style={refreshFlashStyle}>
            {steps.map((step, i) => (
              <SwapRouteExplainerStep key={i} step={step} isFirst={i === 0} isLast={i === steps.length - 1} />
            ))}
          </Animated.View>
        )}
        <SvgIcon name="close" size={32} onPress={onClose} style={[styles.closeIcon, { backgroundColor: theme.colors.light15 }]} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  modal: {
    borderRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    marginHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  container: {
    padding: 24,
  },
  closeIcon: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 24,
    borderRadius: 48,
    marginTop: 28,
  },
});
