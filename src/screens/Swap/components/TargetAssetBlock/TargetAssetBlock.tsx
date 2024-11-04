import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useShouldFilterOut } from '@/components/Reputation/useShouldFilterOut';
import { Skeleton } from '@/components/Skeleton';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { useTheme } from '@/theme/themes';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { SwapAssetSelector } from '../SwapAssetSelector';

import { useSwapContext } from '../SwapContext';

import type { SwapTargetAsset } from '../../types';

import loc from '/loc';

type Props = {
  asset: SwapTargetAsset;
  onChange: () => void;
  showUnlistedExplainer: () => void;
};

export const TargetAssetBlock: React.FC<Props> = ({ asset, onChange, showUnlistedExplainer }) => {
  const wallet = useWalletByAssetId(asset.assetId);

  const reputation = useReputation(asset.assetId);

  const {
    loadingState: [isLoading],
    swapRouteState: [swapData],
    amountInputFocusState: [isAmountInputFocused],
  } = useSwapContext();

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isAmountInputFocused ? 0.75 : 1),
  }));

  const { currency } = useAppCurrency();

  const amount = swapData?.receiveTokenAmount ?? '0';
  const balanceDisplay = useBalanceDisplay(loc.swap.balance);
  const price = useTokenPrice({ assetId: asset.assetId }) ?? 0;

  const { colors } = useTheme();

  const footerLeft = !!amount && !isNaN(Number(amount)) ? formatCurrency(unitConverter.tokenUnit2Fiat(amount, price).toString(10), { currency }) : undefined;
  const tokenAmountFormatted = formatTokenAmountFromToken(asset, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: asset.assetId }) });
  const footerRight = loc.formatString(balanceDisplay, `${tokenAmountFormatted} ${asset.metadata.symbol}`);

  const skipReputationBadge = useShouldFilterOut(
    { assetId: asset.assetId, reputation },
    {
      coinDesignation: ['network'],
      reputation: [REPUTATION.WHITELISTED],
    },
  );

  return (
    <Animated.View style={[styles.container, opacityStyle]}>
      <GradientItemBackground backgroundType="modal" key={String(skipReputationBadge)} />
      <View>
        <Input
          value={isLoading ? undefined : amount}
          editable={false}
          type="boldDisplay5"
          backgroundColor="transparent"
          right={<SwapAssetSelector reputation={reputation} wallet={wallet} asset={asset} onPress={onChange} />}
          footerLeft={isLoading ? undefined : footerLeft}
          footerRight={footerRight}
          footerRightProps={{
            type: 'mediumCaption1',
          }}
          footerLeftProps={{
            type: 'mediumCaption1',
            color: 'light50',
          }}
        />
        {isLoading && (
          <Animated.View pointerEvents="none" entering={FadeIn} style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
            <Skeleton style={styles.skeletonBig} />
            <Skeleton style={styles.skeletonSmall} />
          </Animated.View>
        )}
      </View>
      {!skipReputationBadge && (
        <Touchable onPress={showUnlistedExplainer} style={[styles.cardWarning, { backgroundColor: colors.light8 }]}>
          <SvgIcon name="error" color="yellow500" />
          <Label style={styles.flex} type="regularCaption1" color="light75">
            {loc.tokenLists.unverifiedDescription}{' '}
            <Label type="boldCaption1" color="light75">
              {loc.tokenLists.unverifiedButtonLink}
            </Label>
          </Label>
        </Touchable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 16,
    top: 8,
    justifyContent: 'space-evenly',
    gap: 12,
  },
  skeletonBig: {
    width: 132,
    height: 30,
    borderRadius: 10,
  },
  skeletonSmall: {
    width: 82,
    height: 22,
    borderRadius: 8,
  },
  cardWarning: {
    padding: 16,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
  },
  flex: {
    flex: 1,
  },
});
