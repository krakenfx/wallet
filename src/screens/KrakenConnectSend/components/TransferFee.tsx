import { StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { Label } from '@/components/Label';

import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

interface Props {
  fee: string;
  inputInFiatCurrency: boolean;
  asset: KrakenAssetSupported;
}

export const TransferFee = ({ fee, asset, inputInFiatCurrency }: Props) => {
  const realmTokenPrice = useTokenPrice({ assetId: asset.assetId }) || 0;
  const feeInAppCurrency = Number(fee) * realmTokenPrice;
  const { currency } = useAppCurrency();
  const formatedFeeInAppCurrency = formatCurrency(feeInAppCurrency, { currency });
  const feeAmountFormatted = `${fee} ${asset.symbol}`;
  const value = inputInFiatCurrency ? formatedFeeInAppCurrency : feeAmountFormatted;

  return (
    <View style={styles.container}>
      <Label type="boldCaption1" color="light75">
        {loc.krakenConnect.transfer.transferFee}
      </Label>
      <Label type="boldCaption1">{value}</Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
});
