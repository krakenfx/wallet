import { BottomSheetScrollView, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANIMATION_CONFIGS, BottomSheet, BottomSheetRef } from '@/components/BottomSheet';
import { ReputationInfo } from '@/components/Reputation';
import {
  AboutAsset,
  ContractAddress,
  Explorers,
  GeneralMarketData,
  GeneralMarketDataMediumInfo,
  HistoricalAssetPriceChart,
  Links,
  PercentageChange,
  PriceAndChangeSmallInfo,
  ReputationSmallOrMediumInfo,
} from '@/components/TokenMarketData';
import { SheetPosition } from '@/components/TokenMarketData/utils';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { isNetworkCoin as isNetworkCoinCheck } from '@/onChain/wallets/registry';
import { useAssetMarketData } from '@/realm/assetMarketData';
import { useAssetMetadata } from '@/realm/assetMetadata';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useTokenById } from '@/realm/tokens';
import { useNetworkFeeEstimate } from '@/screens/Send/hooks/useNetworkFeeEstimate';

import { NetworkFeeEstimate } from './NetworkFeeEstimate';

export const SMALL_SHEET_MIN_HEIGHT = 88;

interface Props {
  tokenId: string;
  onPositionChange?: (position: SheetPosition) => void;
  positionIndex?: SheetPosition;
}

export const defaultSheetPosition = SheetPosition.MEDIUM;
const INITIAL_SHEET_ANIMATION_TIME = 800;
const DEFAULT_SHEET_ANIMATION_TIME = 300;

export const TokenMarketDataBottomSheet = ({ tokenId, onPositionChange, positionIndex }: Props) => {
  const defaultSnapPoints = useCommonSnapPoints('toHeaderAndMainContent');
  const { bottom } = useSafeAreaInsets();
  const ref = useRef<BottomSheetRef>(null);
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
  const [isInitialised, setIsInitialised] = useState(false);
  const sheetAnimatedIn = useSharedValue(false);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const token = useTokenById(tokenId);
  const isNetworkCoin = isNetworkCoinCheck(token.assetId);
  const assetMarketData = useAssetMarketData({ assetId: token.assetId, refresh: true });
  const assetMetadata = useAssetMetadata({ assetId: token.assetId, refresh: true });
  const tokenPrice = useTokenPrice({ assetId: token.assetId, refresh: true });

  const handleSheetPositionChange = (index: SheetPosition) => {
    onPositionChange?.(index);
  };

  useEffect(() => {
    setTimeout(() => setIsInitialised(true), INITIAL_SHEET_ANIMATION_TIME);
  }, []);

  useEffect(() => {
    if (positionIndex !== undefined && positionIndex === SheetPosition.SMALL) {
      ref.current?.snapToIndex(SheetPosition.SMALL);
      setSheetPosition(positionIndex);
    }
  }, [positionIndex]);

  const aIndex = useSharedValue(defaultSheetPosition);

  const networkFeeEstimate = useNetworkFeeEstimate(token.walletId, !isNetworkCoin);

  useAnimatedReaction(
    () => {
      if (aIndex.value < 0.2) {
        return SheetPosition.SMALL;
      } else if (aIndex.value > 1.2) {
        return SheetPosition.HIGH;
      } else {
        return SheetPosition.MEDIUM;
      }
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

  const animationConfigs = useBottomSheetTimingConfigs({
    ...ANIMATION_CONFIGS,
    duration: isInitialised ? DEFAULT_SHEET_ANIMATION_TIME : INITIAL_SHEET_ANIMATION_TIME,
    easing: isInitialised ? undefined : Easing.inOut(Easing.quad),
  });

  const paddingBottom = useBottomElementSpacing(24);

  return (
    <BottomSheet
      animatedIndex={aIndex}
      snapPoints={snapPoints}
      animateOnMount
      animationConfigs={animationConfigs}
      index={defaultSheetPosition}
      dismissible={false}
      noSafeInsetTop
      noBackdrop
      ref={ref}
      onChange={handleSheetPositionChange}>
      <BottomSheetScrollView contentContainerStyle={[styles.container, { paddingBottom }]}>
        {sheetPosition === SheetPosition.SMALL ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.smallOrMediumContainer}>
            <PriceAndChangeSmallInfo tokenId={tokenId} price={tokenPrice} />
            {isNetworkCoin ? (
              <NetworkFeeEstimate data={networkFeeEstimate} size="small" />
            ) : (
              <ReputationSmallOrMediumInfo assetId={token.assetId} size="small" />
            )}
          </Animated.View>
        ) : (
          <HistoricalAssetPriceChart assetId={token.assetId} tokenId={tokenId} size={sheetPosition} price={tokenPrice} />
        )}
        {sheetPosition === SheetPosition.MEDIUM && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.smallOrMediumContainer}>
            <GeneralMarketDataMediumInfo tokenId={tokenId} />
            {isNetworkCoin ? (
              <NetworkFeeEstimate data={networkFeeEstimate} size="medium" />
            ) : (
              <ReputationSmallOrMediumInfo assetId={token.assetId} size="medium" />
            )}
          </Animated.View>
        )}

        {sheetPosition === SheetPosition.HIGH && (
          <>
            <PercentageChange priceChangePercentage={assetMarketData?.priceChangePercentage} />
            <GeneralMarketData marketData={assetMarketData} />
            {isNetworkCoin && <NetworkFeeEstimate data={networkFeeEstimate} size="big" />}
            <ReputationInfo assetId={token.assetId} />
            {!isNetworkCoin && assetMetadata?.tokenAddress && <ContractAddress contractAddress={assetMetadata.tokenAddress} networkName={token.wallet.type} />}
            {assetMetadata && <Explorers explorers={assetMetadata.explorers} />}
            {assetMetadata?.description && <AboutAsset description={assetMetadata.description} assetSymbol={assetMetadata.symbol} />}
            <Links links={assetMetadata?.links} />
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 24,
  },
  smallOrMediumContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
});
