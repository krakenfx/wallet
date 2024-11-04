import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

type OnboardingWordButtonProps = {
  word: string;
  prefix?: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
} & (
  | {
      id?: never;
      onPress?: (word: string) => void;
    }
  | {
      id: number;
      onPress: (word: string, id: number) => void;
    }
);

export const OnboardingWordButton = React.memo(({ word, prefix, testID, containerStyle, buttonStyle, ...props }: OnboardingWordButtonProps) => {
  const handlePress = () => {
    if ('id' in props) {
      props.id !== undefined && props.onPress(word, props.id);
    } else {
      props.onPress?.(word);
    }
  };

  const { colors } = useTheme();

  return (
    <Touchable style={[styles.button, containerStyle]} disabled={!props.onPress} onPress={handlePress}>
      <View
        testID={testID ?? `${prefix}${word}`}
        style={[{ backgroundColor: colors.light8 }, styles.container, prefix ? styles.small : styles.large, buttonStyle]}>
        {!!prefix && (
          <Label type="boldMonospace" color="light50" style={styles.prefix}>
            {prefix}
          </Label>
        )}
        <Label type="boldMonospace">{word}</Label>
      </View>
    </Touchable>
  );
});

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 6,
    marginBottom: 12,
  },
  container: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  prefix: {
    marginRight: 3,
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
