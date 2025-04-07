import type React from 'react';

import type { FlatList } from 'react-native-gesture-handler';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BottomSheetModal, type BottomSheetModalRef } from '@/components/BottomSheet';

import { EARN_SHEET_ANIMATION_CONFIG } from '../../EarnScreen.constants';
import { DefiEarnSheetHeader } from '../DefiEarnSheetHeader/DefiEarnSheetHeader';

import { DefiEarnSheetList } from '../DefiEarnSheetList/DefiEarnSheetList';

import { type DefiEarnSheetProps, SheetPosition } from './DefiEarnSheet.types';

export const DefiEarnSheet: React.FC<DefiEarnSheetProps> = ({ assetId, protocols, onCloseEarnSheet }) => {
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(SheetPosition.MEDIUM);

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const flatListRef = useRef<FlatList>(null);

  const headerHeight = useHeaderHeight();

  const isHeaderShrunk = useSharedValue(false);

  useEffect(() => {
    if (assetId) {
      bottomSheetModalRef.current?.present();
    }
  }, [bottomSheetModalRef, assetId]);

  const coinsImageStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isHeaderShrunk.value ? 0 : 1, EARN_SHEET_ANIMATION_CONFIG),
    transform: [
      {
        scale: withTiming(isHeaderShrunk.value ? 0 : 1, EARN_SHEET_ANIMATION_CONFIG),
      },
    ],
  }));

  const handleSheetPositionChange = (index: number) => {
    if (index === 1) {
      setSheetPosition(SheetPosition.HIGH);
      return;
    }

    setSheetPosition(SheetPosition.MEDIUM);
    isHeaderShrunk.value = false;
    flatListRef.current?.scrollToIndex({ index: 0, animated: false, viewOffset: 0 });
  };

  const closeEarnSheet = useCallback(() => {
    bottomSheetModalRef?.current?.close();
    onCloseEarnSheet();
  }, [bottomSheetModalRef, onCloseEarnSheet]);

  return (
    <BottomSheetModal ref={bottomSheetModalRef} topInset={headerHeight} enableDynamicSizing onDismiss={onCloseEarnSheet} onChange={handleSheetPositionChange}>
      <BottomSheetView style={styles.container} testID="DefiEarnSheet">
        <Animated.Image style={[StyleSheet.absoluteFill, styles.coinsImage, coinsImageStyle]} source={require('@/assets/images/common/coinsGroup.webp')} />
        <DefiEarnSheetHeader assetId={assetId} closeEarnSheet={closeEarnSheet} isHeaderShrunk={isHeaderShrunk} />
        {!!protocols.length && (
          <DefiEarnSheetList
            ref={flatListRef}
            protocols={protocols}
            isHeaderShrunk={isHeaderShrunk}
            scrollEnabled={sheetPosition === SheetPosition.HIGH}
            closeEarnSheet={closeEarnSheet}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 48,
    flex: 1,
  },
  coinsImage: {
    top: -90,
  },
});
