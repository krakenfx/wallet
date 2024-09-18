import React from 'react';
import { Keyboard, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { CurvedTransition, FadeIn, FadeOut } from 'react-native-reanimated';

import { FeeOption, FeeOptionKind } from '@/api/types';
import { Label } from '@/components/Label';
import { Menu } from '@/components/Menu';
import { DropdownOptionItem } from '@/components/Menu/DropdownMenu';
import { NetworkIcon } from '@/components/NetworkIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { RealmishWallet } from '@/onChain/wallets/base';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTheme } from '@/theme/themes';

import { FeeEstimationMap } from '../types';
import { getFeeOptionsData } from '../utils/getFeeOptionsData';

import loc from '/loc';

interface FeeSelectorProps {
  style?: StyleProp<ViewStyle>;
  selected: FeeOptionKind;
  onChange: (option: FeeOptionKind) => void;
  options: FeeOption[];
  feeEstimates: FeeEstimationMap;
  wallet: RealmishWallet;
  price?: number;
  disabled?: boolean;
  inputInFiat?: boolean;
  showTitle?: boolean;
  showEstimatedTime?: boolean;
  compact?: boolean;
}

export const FeeSelector = React.memo(
  ({
    style,
    onChange,
    options,
    selected,
    wallet,
    price,
    feeEstimates,
    disabled,
    inputInFiat = false,
    showTitle = true,
    showEstimatedTime = true,
    compact,
  }: FeeSelectorProps) => {
    const { colors } = useTheme();
    const hasSingleOption = options.length === 1;
    const { currency } = useAppCurrency();

    const data = getFeeOptionsData(options, wallet, feeEstimates, currency, price, inputInFiat).map(
      o =>
        ({
          ...o,
          labelLeft: o.name,
          labelRight: o.amount,
          labelBottomLeft: o.duration,
          labelBottomRight: o.rate,
        } satisfies DropdownOptionItem<FeeOptionKind>),
    );

    if (!options.length) {
      return null;
    }

    const currentOption = data.filter(o => o.id === selected)[0];

    return (
      <Animated.View layout={CurvedTransition} entering={FadeIn} exiting={FadeOut} testID="FeeSelector">
        {hasSingleOption ||
          (showTitle && (
            <Label type="boldTitle2" style={styles.sectionHeader}>
              {loc.send.network_fee}
            </Label>
          ))}
        <Menu
          disabled={disabled || hasSingleOption}
          refreshKey={Object.values(feeEstimates)
            .map(e => e.amount)
            .join()}
          onShow={Keyboard.dismiss}
          menuYOffset={-8}
          type="dropdown"
          onSelect={({ id }) => onChange(id)}
          selectedId={selected}
          options={data}>
          <View style={[styles.container, { backgroundColor: colors.dark25 }, compact && styles.compact, style, hasSingleOption && styles.transparent]}>
            <View style={styles.row}>
              {!!wallet?.type && <NetworkIcon networkName={wallet.type} size={16} />}
              {showTitle && hasSingleOption && <Label>{loc.send.network_fee}</Label>}
              <Label style={showEstimatedTime && hasSingleOption === false ? styles.header : styles.sendConfirmHeader} type="boldMonospace">
                {!hasSingleOption && (
                  <>
                    {currentOption.labelLeft}
                    {showEstimatedTime && (
                      <Label type="boldMonospace" color="light50">
                        {currentOption.labelBottomLeft && ` ~${currentOption.labelBottomLeft}`}
                      </Label>
                    )}
                  </>
                )}
              </Label>
            </View>
            <View style={styles.feeRowFee}>
              <Label type="boldMonospace">{currentOption.labelRight}</Label>
              {!disabled && !hasSingleOption && <SvgIcon name="chevron-down" size={16} style={styles.chevron} />}
            </View>
          </View>
        </Menu>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  feeRowFee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chevron: {
    marginLeft: 8,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  header: {
    marginLeft: 4,
    flexWrap: 'wrap',
    flexBasis: '50%',
  },
  sendConfirmHeader: {
    marginLeft: 4,
  },
  compact: {
    backgroundColor: 'transparent',
    padding: 0,
  },
});
