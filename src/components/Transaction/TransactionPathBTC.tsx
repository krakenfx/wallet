import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AddressDisplay } from '@/components/AddressDisplay';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

type Props = {
  to: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TransactionPathBTC = ({ to, containerStyle }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <GradientItemBackground backgroundType="modal" />
      <View style={styles.row}>
        <View style={styles.left}>
          <SvgIcon size={20} name="wallet" style={[styles.icon, { backgroundColor: colors.light15 }]} />
          <Label>{loc.transactionDetails.toBTC}</Label>
        </View>
        <View>
          <AddressDisplay address={to} textStyle={styles.address} hasSpaces />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginVertical: 6,
    overflow: 'hidden',
  },
  icon: {
    borderRadius: 20,
    marginRight: 12,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
  },
  address: {
    flex: 0,
  },
});
