import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Switch as StateLessSwitch, SwitchProps } from 'react-native';

import { useTheme } from '@/theme/themes';

import { handleError } from '/helpers/errorHandler';

type Props = SwitchProps & {
  onValueChange: (value: boolean) => void | Promise<void>;
};

const UPDATE_LOCAL_STATE_WITH_VALUE_FROM_PROPS_TIMEOUT = 1000;


export const Switch: React.FC<Props> = ({ value, onValueChange, ...props }) => {
  const [switchValue, setSwitchValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();
  const latest = useRef(value);

  latest.current = value;

  useFocusEffect(
    useCallback(() => {
      setSwitchValue(value);
    }, [value]),
  );

  const updateValueFromProps = () => {
    
    setSwitchValue(latest.current);
  };

  const onChange = async (newValue: boolean) => {
    setSwitchValue(newValue);
    const callback = onValueChange(newValue);
    if (callback instanceof Promise) {
      try {
        setIsLoading(true);
        await callback;
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        setSwitchValue(!newValue);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(updateValueFromProps, UPDATE_LOCAL_STATE_WITH_VALUE_FROM_PROPS_TIMEOUT);
    }
  };

  return (
    <StateLessSwitch
      thumbColor={colors.light100}
      ios_backgroundColor={isLoading ? (switchValue ? colors.light15 : colors.kraken) : undefined}
      trackColor={isLoading ? { true: colors.light15, false: colors.kraken } : { true: colors.kraken, false: colors.light15 }}
      accessible
      accessibilityRole="switch"
      value={switchValue}
      onValueChange={onChange}
      {...props}
    />
  );
};
