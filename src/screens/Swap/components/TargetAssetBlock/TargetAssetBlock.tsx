import type React from 'react';

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { useShouldFilterOut } from '@/components/Reputation/useShouldFilterOut';
import { Skeleton } from '@/components/Skeleton';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { useTheme } from '@/theme/themes';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { SwapAssetSelector } from '../SwapAssetSelector';

import { useSwapContext } from '../SwapContext';

import type { SwapRouteUIData, SwapTargetAsset } from '../../types';

import loc from '/loc';

type Props = {
  asset: SwapTargetAsset;
  route?: SwapRouteUIData;
  onChange: () => void;
  showUnlistedExplainer: () => void;
};

export const TargetAssetBlock: React.FC<Props> = ({ asset, route, onChange, showUnlistedExplainer }) => {
  const wallet = useWalletByAssetId(asset.assetId);

  const reputation = useReputation(asset.assetId);

  const {
    loadingState: [isLoading],
    amountInputFocusState: [isAmountInputFocused],
    refreshFlashStyle,
    fiatAmountToggle,
  } = useSwapContext();

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isAmountInputFocused ? 0.75 : 1),
  }));

  const { currency } = useAppCurrency();

  const balanceDisplay = useBalanceDisplay(loc.swap.balance);
  const price = useTokenPrice({ assetId: asset.assetId }) ?? 0;

  const { colors } = useTheme();

  const amount = route?.output ?? '0';

  const outputFormatted = formatTokenAmount(unitConverter.smallUnit2TokenUnit(amount, asset.metadata.decimals).toString(10), {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: isBtc({ assetId: asset.assetId }),
  });

  const fiatOutput =
    !!amount && !isNaN(Number(amount))
      ? formatCurrency(unitConverter.smallestUnit2Fiat(amount, asset.metadata.decimals, price).toString(10), { currency })
      : undefined;

  const { inputInFiatCurrency, styles: fiatToggleStyles } = fiatAmountToggle;

  const value = inputInFiatCurrency ? fiatOutput : outputFormatted;
  const footerLeft = inputInFiatCurrency ? `${outputFormatted} ${asset.metadata.symbol}` : fiatOutput;

  const tokenBalanceAmountFormatted = formatTokenAmountFromToken(asset, {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: isBtc({ assetId: asset.assetId }),
  });
  const fiatTotalBalance = useTokenBalanceConvertedToAppCurrency(asset);

  const footerRight = loc.formatString(
    balanceDisplay,
    inputInFiatCurrency ? formatCurrency(fiatTotalBalance, { currency }) : `${tokenBalanceAmountFormatted} ${asset.metadata.symbol}`,
  );

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
          inputStyle={[refreshFlashStyle, fiatToggleStyles.opacity]}
          value={isLoading ? undefined : value}
          editable={false}
          type="boldDisplay5"
          backgroundColor="transparent"
          right={<SwapAssetSelector reputation={reputation} wallet={wallet} asset={asset} onPress={onChange} />}
          footerLeft={isLoading ? ' ' : footerLeft}
          footerRight={footerRight}
          footerRightProps={{
            type: 'mediumCaption1',
            style: fiatToggleStyles.opacity,
          }}
          footerLeftProps={{
            type: 'mediumCaption1',
            color: 'light50',
            style: [refreshFlashStyle, fiatToggleStyles.opacity],
            entering: undefined,
            exiting: undefined,
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
