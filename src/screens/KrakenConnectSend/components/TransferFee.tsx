import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Label } from '@/components/Label';

import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

interface Props {
  fee: string;
  isInputInFiatCurrency: boolean;
  asset: KrakenAssetSupported;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
}

export const TransferFee = ({ fee, asset, isInputInFiatCurrency, style, isLoading }: Props) => {
  const realmTokenPrice = useTokenPrice({ assetId: asset.assetId }) || 0;
  const feeInAppCurrency = Number(fee) * realmTokenPrice;
  const { currency } = useAppCurrency();
  const formatedFeeInAppCurrency = formatCurrency(feeInAppCurrency, { currency });
  const feeAmountFormatted = `${fee} ${asset.symbol}`;
  const value = isInputInFiatCurrency ? formatedFeeInAppCurrency : feeAmountFormatted;

  return (
    <View style={[styles.container, style]}>
      <Label type="boldCaption1" color="light75">
        {loc.krakenConnect.transfer.transferFee}
      </Label>
      {isLoading ? <ActivityIndicator /> : <Label type="boldCaption1">{value}</Label>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
});
