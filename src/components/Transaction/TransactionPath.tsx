import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

type Props = {
  from?: string;
  to?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

export const TransactionPath = ({ from, to, containerStyle, testID }: Props) => {
  const { colors } = useTheme();

  const renderAddress = (label: string, address: string) => (
    <View style={styles.row}>
      <SvgIcon size={20} name="wallet" style={[styles.icon, { backgroundColor: colors.light15 }]} />
      <View style={styles.flex}>
        <Label type="regularCaption1" color="light50" style={styles.label}>
          {label}
        </Label>
        <Label type="boldCaption1" numberOfLines={1} ellipsizeMode="middle" testID={`Address${label}-${testID}`}>
          {address}
        </Label>
      </View>
    </View>
  );

  if (!from || !to) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <GradientItemBackground backgroundType="modal" />
      {renderAddress(loc.transactionDetails.from, from)}
      <SvgIcon name="chevron-right" color="light75" />
      {renderAddress(loc.transactionDetails.to, to)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginVertical: 6,
    overflow: 'hidden',
    height: 80,
  },
  icon: {
    borderRadius: 20,
    marginRight: 12,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
