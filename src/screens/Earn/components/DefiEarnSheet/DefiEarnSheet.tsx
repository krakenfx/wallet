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

export const DefiEarnSheet: React.FC<DefiEarnSheetProps> = ({ selectedAsset, onCloseEarnSheet }) => {
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(SheetPosition.MEDIUM);

  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const flatListRef = useRef<FlatList>(null);

  const headerHeight = useHeaderHeight();

  const isHeaderShrunk = useSharedValue(false);

  useEffect(() => {
    if (selectedAsset?.assetId) {
      bottomSheetModalRef.current?.present();
    }
  }, [bottomSheetModalRef, selectedAsset?.assetId]);

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
    <BottomSheetModal
      ref={bottomSheetModalRef}
      topInset={headerHeight}
      snapPoints={['70%', '100%']}
      onDismiss={onCloseEarnSheet}
      onChange={handleSheetPositionChange}>
      {selectedAsset?.assetId && (
        <BottomSheetView style={styles.container}>
          <Animated.Image style={[StyleSheet.absoluteFill, styles.coinsImage, coinsImageStyle]} source={require('@/assets/images/common/coinsGroup.webp')} />

          <DefiEarnSheetHeader assetId={selectedAsset?.assetId} closeEarnSheet={closeEarnSheet} isHeaderShrunk={isHeaderShrunk} />

          <DefiEarnSheetList
            ref={flatListRef}
            protocols={selectedAsset.protocols}
            isHeaderShrunk={isHeaderShrunk}
            scrollEnabled={sheetPosition === SheetPosition.HIGH}
          />
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 24,
    flex: 1,
  },
  coinsImage: {
    top: -90,
  },
});
