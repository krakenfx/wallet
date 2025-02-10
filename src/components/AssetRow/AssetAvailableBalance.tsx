import BigNumber from 'bignumber.js';
import { StyleSheet, View } from 'react-native';

import { FadeIn } from 'react-native-reanimated';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';

import { useAppCurrency } from '@/realm/settings';
import { formatCurrency } from '@/utils/formatCurrency';

import { Label } from '../Label';

import loc from '/loc';

interface Props {
  asset: KrakenAssetSupported;
}

const AvailableBalanceInFiat = ({ asset }: Props) => {
  const { currency } = useAppCurrency();

  const amountInAppCurrency =
    useTokenBalanceConvertedToAppCurrency({
      ...asset,
      balance: new BigNumber(asset.balance).minus(asset.hold_trade).toString(10),
    }) ?? 0;
  const amountFormatted = useBalanceDisplay(formatCurrency(amountInAppCurrency, { currency }), 7);
  const availableAmountText = loc.formatString(loc.krakenConnect.transfer.available, { value: amountFormatted });

  return (
    <Label entering={FadeIn} type="regularCaption1" color="light50" style={styles.priceLabel}>
      {availableAmountText}
    </Label>
  );
};

export const AssetAvailableBalance = ({ asset }: Props) => {
  if (Number(asset.hold_trade) === 0) {
    return null;
  }

  return (
    <View style={styles.labelContainer}>
      <AvailableBalanceInFiat asset={asset} />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  label: {
    marginRight: 8,
  },
  priceLabel: {
    alignItems: 'flex-start',
    textAlign: 'left',
    minWidth: 100,
  },
  fiat: {
    alignItems: 'flex-end',
    textAlign: 'right',
    minWidth: 100,
  },
});
