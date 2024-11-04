import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FeeOptionKind } from '@/api/types';
import { Label } from '@/components/Label';
import { ToggleRow } from '@/components/ToggleRow';
import type { RealmishWallet } from '@/onChain/wallets/base';

import { feeOptionToString } from './utils/feeOptionToString';

interface FeeSelectorOptionProps {
  option: FeeOptionKind;
  rate: string;
  selected: boolean;
  onChange: (option: FeeOptionKind) => void;
  wallet: RealmishWallet;
}

export const FeeSelectorOption = ({ option, selected, onChange, rate }: FeeSelectorOptionProps) => {
  const onPress = useCallback(() => {
    onChange(option);
  }, [onChange, option]);

  return (
    <ToggleRow selected={selected} onPress={onPress}>
      <View style={styles.row}>
        <Label>{feeOptionToString(option)}</Label>
        <Label style={styles.rate}>{rate}</Label>
      </View>
    </ToggleRow>
  );
};

const styles = StyleSheet.create({
  rate: {
    marginLeft: 'auto',
  },
  row: {
    flexDirection: 'row',
    flexGrow: 1,
    gap: 40,
    minWidth: 100,
  },
});
