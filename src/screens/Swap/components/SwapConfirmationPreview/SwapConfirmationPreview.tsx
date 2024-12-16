import type React from 'react';

import BigNumber from 'bignumber.js';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';

import Animated, { type AnimatedStyle, type SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { CardWarning } from '@/components/CardWarning';
import { DoubleRow } from '@/components/DoubleRow';
import { Label } from '@/components/Label';
import { type ExpandableSheetComponentProps } from '@/components/Sheets';
import { TransactionAmountWithAppCurrency } from '@/components/Transaction';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import { useAppCurrency } from '@/realm/settings';

import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import type { Warning } from '@/types';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { LoadingBlock } from '../LoadingBlock';
import { RouteDetailsRow } from '../RouteDetailsRow';
import { RoutePreviewButton } from '../RoutePreviewButton';

import { RouteTimeoutCircle } from '../RouteTimeoutCircle';

import type { SwapRouteUIData } from '../../types';

import loc from '/loc';

type Props = ExpandableSheetComponentProps & {
  route: SwapRouteUIData;
  showExplainer: () => void;
  timeoutProgress: SharedValue<number>;
  refreshFlashStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle | TextStyle>>>;
  isLoading?: boolean;
  warning?: Warning;
};

export const SwapConfirmationPreview: React.FC<Props> = ({
  animatedIndex,
  timeoutProgress,
  showExplainer,
  route: { sourceAsset, sourceAssetAmount, output, steps, targetAsset, rate, transactionFeesTotalFiat, duration },
  refreshFlashStyle,
  isLoading,
  warning,
}) => {
  const collapsedFooterStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 1], [1, 0]),
    };
  }, []);

  const expandedFooterStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
    };
  }, []);

  const { currency } = useAppCurrency();

  const sourceAmountNegated = BigNumber(sourceAssetAmount).negated().toString(10);

  const sourceTokenAmount = unitConverter.smallUnit2TokenUnit(sourceAmountNegated, sourceAsset.metadata.decimals).toString(10);
  const sourceTokenAmountFormatted = formatTokenAmount(sourceTokenAmount, {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: isBtc({ assetId: sourceAsset.assetId }),
  });

  const targetTokenAmount = unitConverter.smallUnit2TokenUnit(output, targetAsset.metadata.decimals).toString(10);
  const targetTokenAmountFormatted = formatTokenAmount(targetTokenAmount, {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: isBtc({ assetId: sourceAsset.assetId }),
  });
  const targetAssetWallet = useWalletByAssetId(targetAsset.assetId);
  const targetAssetReputation = useReputation(targetAsset.assetId);

  return (
    <View>
      <Label type="boldTitle1" style={styles.title}>
        {loc.swap.confirmation.confirm}
      </Label>
      {warning?.severity === 'critical' && <CardWarning title={loc.swap.confirmation.swapFlagged} type="negative" description={warning.message} />}
      <DoubleRow
        iconName="double-chevron-down"
        renderTop={({ containerStyle }) => (
          <TransactionAmountWithAppCurrency
            assetId={sourceAsset.assetId}
            decimals={sourceAsset.metadata.decimals}
            balance={sourceAmountNegated}
            assetAmount={sourceTokenAmountFormatted}
            assetNetwork={sourceAsset.wallet.type}
            assetSymbol={sourceAsset.metadata.symbol}
            assetAmountLabelProps={{ type: 'boldDisplay3' }}
            fiatAmountLabelProps={{ type: 'mediumCaption1' }}
            containerStyle={containerStyle}
          />
        )}
        renderBottom={({ containerStyle }) => (
          <TransactionAmountWithAppCurrency
            assetId={targetAsset.assetId}
            decimals={targetAsset.metadata.decimals}
            balance={output}
            assetAmount={targetTokenAmountFormatted}
            assetNetwork={targetAssetWallet.type}
            assetSymbol={targetAsset.metadata.symbol}
            assetReputation={targetAssetReputation !== REPUTATION.WHITELISTED ? targetAssetReputation : undefined}
            containerStyle={containerStyle}
            assetAmountLabelProps={{ style: refreshFlashStyle, type: 'boldDisplay3' }}
            fiatAmountLabelProps={{ style: refreshFlashStyle, type: 'mediumCaption1' }}
            isLoading={isLoading}
          />
        )}
      />
      {isLoading ? (
        <LoadingBlock backgroundColor="transparent" containerStyle={styles.loadingBlock} />
      ) : (
        <Animated.View style={refreshFlashStyle}>
          <Animated.View style={[styles.footer, collapsedFooterStyle]}>
            <RouteDetailsRow labelLeft={loc.swap.route.swapRate} labelRight={rate} />
            <RouteDetailsRow labelLeft={loc.swap.route.transactionFees} labelRight={transactionFeesTotalFiat} />
          </Animated.View>
          <Animated.View style={[styles.footer, StyleSheet.absoluteFillObject, expandedFooterStyle]}>
            <View style={styles.expandedContent}>
              <View style={styles.expandedHeader}>
                <RouteDetailsRow labelLeft={loc.swap.title} />
                <RouteTimeoutCircle progress={timeoutProgress} />
              </View>
              <RoutePreviewButton duration={duration} steps={steps} onPress={showExplainer} />
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: 16,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 8,
  },
  expandedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  loadingBlock: {
    marginTop: 12,
  },
});
