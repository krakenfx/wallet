import type React from 'react';

import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';
import { sanitizeNumericValue } from '@/utils/sanitizeNumericValue';

import { FIXED_SLIPPAGE_PRESET_OPTIONS } from '../../SwapScreen.constants';

import { SlippageSettingsInput } from '../SlippageSettingsInput';

import loc from '/loc';

type Props = {
  value: string;
  onChange: (value: number | string) => void;
};

export const enforceMaxDecimals = (value: string) => {
  if (value.includes('.')) {
    const [integerPart, decimalPart] = value.split('.');
    if (decimalPart.length > 2) {
      return [integerPart, decimalPart.slice(0, 2)].join('.');
    }
  }
  return value;
};

export const SlippageSettings: React.FC<Props> = ({ onChange, value }) => {
  const { colors } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<number | undefined>(FIXED_SLIPPAGE_PRESET_OPTIONS.find(o => o.toString() === value));
  const [inputValue, setInputValue] = useState<string | undefined>(selectedPreset ? undefined : value);

  const onPresetSelected = (value: number) => {
    Keyboard.dismiss();
    setInputValue(undefined);
    setSelectedPreset(value);
    onChange(value);
  };

  const onInputChange = (value: string) => {
    if (selectedPreset) {
      setSelectedPreset(undefined);
    }
    const newValue = enforceMaxDecimals(sanitizeNumericValue(value));
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.presetOptions}>
        {FIXED_SLIPPAGE_PRESET_OPTIONS.map(value => {
          const isSelected = value === selectedPreset;
          return (
            <Touchable
              key={value}
              style={[styles.fixedOption, { backgroundColor: isSelected ? colors.purple_60 : colors.purple_20 }]}
              onPress={() => onPresetSelected(value)}>
              <Label color={isSelected ? 'light100' : 'light75'}>{value}%</Label>
            </Touchable>
          );
        })}
      </View>
      <SlippageSettingsInput
        placeholder={loc.swap.slippageSettings.custom}
        containerStyle={styles.inputContainerStyle}
        value={inputValue}
        onChangeText={onInputChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  inputContainerStyle: {
    flex: 1,
    marginLeft: 16,
  },
  fixedOption: {
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
});
