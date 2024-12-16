import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label, type LabelProps } from '@/components/Label';
import type { TokenIconProps } from '@/components/TokenIcon';
import { TokenIcon } from '@/components/TokenIcon';
import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';

import type { REPUTATION } from '@/hooks/useReputation';
import type { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { formatCurrency } from '@/utils/formatCurrency';

import { ReputationTag } from '../Reputation';
import { Skeleton } from '../Skeleton';

export type TransactionAmountProps = {
  attached?: boolean;
  label?: string;

  assetAmount: StringNumber;
  assetFiatAmount?: StringNumber;

  assetNetwork: WalletType;
  assetSymbol?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  tokenIconProps?: TokenIconProps;
  assetAmountLabelProps?: LabelProps;
  fiatAmountLabelProps?: LabelProps;
  isLoading?: boolean;
  assetReputation?: REPUTATION;
};

export const TransactionAmount = ({
  assetAmount,
  assetFiatAmount,
  assetNetwork,
  assetSymbol,
  attached,
  containerStyle,
  label,
  assetAmountLabelProps,
  fiatAmountLabelProps,
  assetReputation,
  isLoading,
  ...props
}: TransactionAmountProps) => {
  if (!assetSymbol) {
    return null;
  }
  return (
    <View style={[styles.container, containerStyle, attached && styles.attached]} testID={props.testID}>
      <GradientItemBackground backgroundType="modal" />
      <View style={styles.assetMetadata}>
        {'tokenIconProps' in props ? (
          <TokenIcon size={40} {...props.tokenIconProps} testID={`TokenIcon-${props.testID}`} />
        ) : (
          <TokenIcon size={40} networkName={assetNetwork} tokenSymbol={assetSymbol} testID={`TokenIcon-${props.testID}`} />
        )}
        <View style={styles.assetSymbolRow}>
          <Label type="boldBody" numberOfLines={1} style={styles.assetSymbol} testID={`AssetSymbol-${props.testID}`}>
            {assetSymbol}
          </Label>
          {!!assetReputation && <ReputationTag reputation={assetReputation} />}
        </View>
      </View>
      {label ? (
        <View style={styles.label}>
          <Label type="regularMonospace" color="light50" adjustsFontSizeToFit numberOfLines={1}>
            {label}
          </Label>
        </View>
      ) : (
        <View style={styles.assetAmounts}>
          <Label type="boldDisplay2" style={styles.assetAmount} numberOfLines={1} testID={`AssetAmount-${props.testID}`} {...assetAmountLabelProps}>
            {isLoading ? ' ' : assetAmount}
          </Label>
          <Label type="regularMonospace" color="light50" testID={`FiatAmount-${props.testID}`} {...fiatAmountLabelProps}>
            {}
            {isLoading ? ' ' : assetFiatAmount || ' '}
          </Label>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <Skeleton style={styles.skeletonBig} />
              <Skeleton style={styles.skeletonSmall} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  assetAmounts: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
    flex: 1,
    minWidth: 50,
    height: 80,
    paddingVertical: 8,
  },
  label: {
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    marginLeft: 12,
    flex: 1,
    minWidth: 50,
  },
  assetAmount: {
    lineHeight: 41,
  },
  assetSymbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  container: {
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 6,
    height: 80,
    overflow: 'hidden',
  },
  attached: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 1,
  },
  assetMetadata: {
    flexDirection: 'row',
    flexShrink: 2,
    alignItems: 'center',
    gap: 12,
  },
  assetSymbol: {
    flexShrink: 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    gap: 8,
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
});

type TransactionAmountWithAppCurrencyProps = {
  assetId: string;
  decimals: number;
  balance: string;
} & TransactionAmountProps;

export const TransactionAmountWithAppCurrency = ({ assetId, decimals, balance, ...props }: TransactionAmountWithAppCurrencyProps) => {
  const assetFiatAmount = useAppCurrencyValue({ assetId, metadata: { decimals } }, balance);
  const { currency } = useAppCurrency();
  const formatted = assetFiatAmount ? formatCurrency(assetFiatAmount, { currency }) : '';

  return <TransactionAmount assetFiatAmount={formatted} {...props} />;
};
