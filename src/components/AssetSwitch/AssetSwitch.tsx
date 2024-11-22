import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import type { AssetRowProps } from '@/components/AssetRow';
import { AssetRow } from '@/components/AssetRow';
import { useRefreshKey } from '@/hooks/useRefreshKey';
import { useRealmWalletById } from '@/realm/wallets';
import { runAfterUISync } from '@/utils/runAfterUISync';

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

  const onPress = useCallback(() => {
    setSwitchValue(!value);
    runAfterUISync(() => {
      onValueChange(!value, wallet?.id);
    });
  }, [onValueChange, value, wallet?.id]);

  const opt = useMemo(
    () => ({
      hideZeroAmount: options.hideZeroAmount,
      networkName: options.networkName,
      onPress,
      priceChange: options.priceChange,
      showAmountInFiat: options.showAmountInFiat,
      style: styles.switch,
      selected: switchValue,
      symbolUnderLabel: options.symbolUnderLabel,
      tag: options.tag,
      testID: `Switch-${token.assetId}`,
      walletId: options.walletId,
      readonly: options.readonly,
      disableLongPress: true,
    }),
    [onPress, options, token.assetId, switchValue],
  );

  return <AssetRow token={token} options={opt} />;
};

const styles = StyleSheet.create({
  switch: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 52,
  },
});
