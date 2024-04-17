import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useRefreshKey } from '@/hooks/useRefreshKey';
import { useRealmWalletById } from '@/realm/wallets';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { AssetRow, AssetRowProps } from './AssetRow';

type AssetSwitchProps = AssetRowProps & {
  onValueChange: (value: boolean, walletId?: string) => Promise<void> | void;
  value?: boolean;
};

export const AssetSwitch = ({ value, onValueChange, token, options = {} }: AssetSwitchProps) => {
  const wallet = useRealmWalletById(options.walletId);

  const refreshKey = token.assetId + value;

  const [switchValue, setSwitchValue] = useState(value);

  const onRefreshKeyInvalid = useCallback(() => {
    setSwitchValue(value);
  }, [value]);

  useRefreshKey(refreshKey, onRefreshKeyInvalid);

  const onPress = () => {
    setSwitchValue(!value);
    runAfterUISync(() => {
      onValueChange(!value, wallet?.id);
    });
  };

  return (
    <AssetRow
      token={token}
      options={{
        hideZeroAmount: options.hideZeroAmount,
        networkName: options.networkName,
        onPress,
        showAmountInFiat: options.showAmountInFiat,
        style: styles.switch,
        selected: switchValue,
        symbolUnderLabel: options.symbolUnderLabel,
        tag: options.tag,
        testID: `Switch-${token.assetId}`,
        walletId: options.walletId,
        readonly: options.readonly,
      }}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 52,
  },
});
