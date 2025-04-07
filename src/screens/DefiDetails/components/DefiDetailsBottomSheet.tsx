import { BottomSheetScrollView, type BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomSheetRef } from '@/components/BottomSheet';
import { BottomSheet } from '@/components/BottomSheet';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';

import { SheetPosition } from '../utils';

import { DefiDetailsChart } from './DefiDetailsChart';
import { DefiDetailsInfoAsset, DefiDetailsInfoContractAddress, DefiDetailsInfoVault } from './DefiDetailsInfo';
import { DefiDetailsSwitch } from './DefiDetailsSwitch';

export const SMALL_SHEET_MIN_HEIGHT = 220;

interface Props {
  onPositionChange?: (position: SheetPosition) => void;
  positionIndex?: SheetPosition;
}

export const defaultSheetPosition = SheetPosition.MEDIUM;

export const DefiDetailsBottomSheet = ({ onPositionChange, positionIndex }: Props) => {
  const defaultSnapPoints = useCommonSnapPoints('toHeaderAndMainContentSmall');
  const { bottom } = useSafeAreaInsets();
  const ref = useRef<BottomSheetRef>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);

  const snapPoints = useMemo(
    () => [
      SMALL_SHEET_MIN_HEIGHT +
        Platform.select({
          ios: bottom === 0 ? bottom + 16 : bottom,
          default: bottom + 16,
        }),
      ...defaultSnapPoints,
    ],
    [bottom, defaultSnapPoints],
  );
  const sheetAnimatedIn = useSharedValue(false);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const handleSheetPositionChange = (index: SheetPosition) => {
    onPositionChange?.(index);
  };

  useEffect(() => {
    if (positionIndex !== undefined && positionIndex === SheetPosition.SMALL) {
      ref.current?.snapToIndex(SheetPosition.SMALL);
      setSheetPosition(SheetPosition.SMALL);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }

    if (positionIndex !== undefined && positionIndex === SheetPosition.MEDIUM) {
      ref.current?.snapToIndex(SheetPosition.MEDIUM);
      setSheetPosition(SheetPosition.MEDIUM);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [positionIndex]);

  const aIndex = useSharedValue(defaultSheetPosition);

  useAnimatedReaction(
    () => {
      if (aIndex.value < 0.2) {
        return SheetPosition.SMALL;
      }
      if (aIndex.value > 1.2) {
        return SheetPosition.HIGH;
      }
      return SheetPosition.MEDIUM;
    },
    (newPos, prevPos) => {
      if (newPos === defaultSheetPosition) {
        sheetAnimatedIn.value = true;
      }
      if (sheetAnimatedIn.value && newPos !== prevPos) {
        runOnJS(setSheetPosition)(newPos);
      }
    },
  );

  const paddingBottom = useBottomElementSpacing(124);
  const isSheetPositionSmall = sheetPosition === SheetPosition.SMALL;
  return (
    <BottomSheet
      animatedIndex={aIndex}
      snapPoints={snapPoints}
      animateOnMount
      index={defaultSheetPosition}
      dismissible={false}
      noSafeInsetTop
      noBackdrop
      ref={ref}
      onChange={handleSheetPositionChange}>
      <BottomSheetScrollView ref={scrollRef} contentContainerStyle={[styles.container, { paddingBottom }]}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <View style={styles.switchContainer}>
            <DefiDetailsSwitch unset={isSheetPositionSmall} />
          </View>
          <DefiDetailsChart hide={isSheetPositionSmall} />
          <View style={styles.infoContainer}>
            <DefiDetailsInfoVault handleSheetPositionChange={handleSheetPositionChange} />
            <DefiDetailsInfoContractAddress />
            <DefiDetailsInfoAsset />
          </View>
        </Animated.View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 24,
  },
  switchContainer: {
    marginVertical: 10,
  },
  infoContainer: {
    flex: 1,
    gap: 32,
    paddingTop: 48,
    paddingBottom: 32,
  },
});
