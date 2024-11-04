import LottieView from 'lottie-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

type Props = {
  type: 'pending' | 'failed';
};

export const TransactionBadge = ({ type }: Props) => {
  const { colors } = useTheme();

  const {
    fgColor,
    bgColor,
    icon,
    label,
  }: {
    label: string;
    bgColor: ColorName;
    fgColor: ColorName;
    icon: IconName;
  } = useMemo(() => {
    switch (type) {
      case 'pending':
        return {
          label: loc.transactionDetails.state.pending,
          bgColor: 'yellow500_15',
          fgColor: 'yellow500',
          icon: 'repeat',
        };
      case 'failed':
        return {
          label: loc.transactionDetails.state.failed,
          bgColor: 'red400_15',
          fgColor: 'red400',
          icon: 'x-circle',
        };
    }
  }, [type]);

  return (
    <View style={[styles.container, { backgroundColor: colors[bgColor] }]}>
      {icon === 'repeat' ? (
        <LottieView source={require('@/assets/lottie/orangeSpinner.json')} autoPlay loop style={styles.lottie} />
      ) : (
        <SvgIcon size={16} name={icon} color={fgColor} />
      )}

      <Label type="boldCaption1" color={fgColor}>
        {label}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderRadius: 16,
  },
  lottie: {
    width: 16,
    height: 16,
  },
});
