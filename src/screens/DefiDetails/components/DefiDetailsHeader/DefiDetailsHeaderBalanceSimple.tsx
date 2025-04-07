import { StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import type { DefiAsset } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { Label } from '@/components/Label';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useAppCurrency, useIsHideBalancesEnabled } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

interface Props {
  assets: DefiAsset[];
  balanceUsd: number;
  testIDs?: [string, string];
}

export const DefiDetailsHeaderBalanceSimple = ({ assets, balanceUsd, testIDs }: Props) => {
  const { size } = useDeviceSize();
  const { currency, currencyInfo } = useAppCurrency();
  const balancesHidden = useIsHideBalancesEnabled();
  const usdFiatRate = useCurrentUsdFiatRate();
  const balanceInAppCurrency = usdFiatRate * balanceUsd;
  const formattedFiat = useBalanceDisplay(formatCurrency(balanceInAppCurrency, { currency, hideCurrencySign: true }), 7);
  const hasOneAsset = assets.length === 1;
  const text = hasOneAsset ? loc.earn.balance : assets.map(asset => asset.symbol).join(' / ');
  const textFont = hasOneAsset ? 'boldCaption2' : 'regularBody';

  return (
    <View testID={testIDs?.[0]} style={[styles.container, size === 'small' && styles.smallDeviceContainer]}>
      <Label type={textFont} color="light50" style={styles.text}>
        {text}
      </Label>
      <AnimatedNumbers
        fontSize={56}
        glyphSize={42}
        testID={testIDs?.[1]}
        ticker={!balancesHidden ? currencyInfo.symbol : ''}
        tickerFontSize={24}
        type="headerBalance"
        value={formattedFiat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    gap: 8,
  },
  smallDeviceContainer: {
    marginTop: 16,
  },
  text: {
    textTransform: 'uppercase',
  },
});
