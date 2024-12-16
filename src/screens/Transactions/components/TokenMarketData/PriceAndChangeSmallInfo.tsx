import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';
import { useAppCurrency } from '@/realm/settings';
import { useTokenById } from '@/realm/tokens';
import { formatCurrency } from '@/utils/formatCurrency';

import { getPercentageLabel } from '@/utils/formatPercentage';

import { commonStyles } from './styles';
import { PRICE_PLACEHOLDER } from './utils';

interface Props {
  tokenId: string;
  priceNotAvailable?: boolean;
  price?: number;
}

export const PriceAndChangeSmallInfo = ({ tokenId, price }: Props) => {
  const token = useTokenById(tokenId);
  const { currency } = useAppCurrency();
  const { label, color } = getPercentageLabel(token?.marketData?.priceChangePercentage.day, 1, { currency, formatTokenAmount: true });
  const priceNotAvailable = !price;
  const priceLabel = priceNotAvailable ? PRICE_PLACEHOLDER : formatCurrency(price, { currency, findFirstNonZeroDigits: true });
  return (
    <View testID="PriceAndChangeSmallInfo" style={[commonStyles.infoContainer, commonStyles.small, { justifyContent: 'space-evenly' }]}>
      <GradientItemBackground />
      <View style={styles.firstRow}>
        <TokenIcon forceOmitNetworkIcon tokenId={token.assetId} wallet={token.wallet} tokenSymbol={token.metadata.symbol} size={16} style={styles.icon} />
        <Label type="boldBody" color={color}>
          {label}
        </Label>
      </View>
      <Label type="boldBody" color={priceNotAvailable ? 'light50' : 'light100'}>
        {priceLabel}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
