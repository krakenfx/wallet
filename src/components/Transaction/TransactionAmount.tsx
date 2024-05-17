import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon, TokenIconProps } from '@/components/TokenIcon';
import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';

import { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';

import { GradientItemBackground } from '../GradientItemBackground';

import { formatAppCurrencyValue } from '/modules/text-utils';

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
};

export const TransactionAmount = ({
  assetAmount,
  assetFiatAmount,
  assetNetwork,
  assetSymbol,
  attached,
  containerStyle,
  label,
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
        <Label type="boldBody" numberOfLines={1} style={styles.assetSymbol} testID={`AssetSymbol-${props.testID}`}>
          {assetSymbol}
        </Label>
      </View>
      {label ? (
        <View style={styles.label}>
          <Label type="regularMonospace" color="light50" adjustsFontSizeToFit numberOfLines={1}>
            {label}
          </Label>
        </View>
      ) : (
        <View style={styles.assetAmounts}>
          <Label type="boldDisplay2" adjustsFontSizeToFit numberOfLines={1} testID={`AssetAmount-${props.testID}`}>
            {assetAmount}
          </Label>
          <Label type="regularMonospace" color="light50" style={styles.fiatAmount} testID={`FiatAmount-${props.testID}`}>
            {}
            {assetFiatAmount || ' '}
          </Label>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  assetAmounts: {
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    marginLeft: 12,
    flex: 1,
    minWidth: 50,
  },
  label: {
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    marginLeft: 12,
    flex: 1,
    minWidth: 50,
  },
  fiatAmount: {
    marginTop: 2,
  },
  container: {
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});

type TransactionAmountWithAppCurrencyProps = {
  assetId: string;
  decimals: number;
  balance: string;
} & TransactionAmountProps;

export const TransactionAmountWithAppCurrency = ({ assetId, decimals, balance, ...props }: TransactionAmountWithAppCurrencyProps) => {
  const assetFiatAmount = useAppCurrencyValue({ assetId, metadata: { decimals } }, balance);
  const { currency } = useAppCurrency();
  const formatted = assetFiatAmount ? formatAppCurrencyValue(assetFiatAmount, currency) : '';

  return <TransactionAmount assetFiatAmount={formatted} {...props} />;
};
