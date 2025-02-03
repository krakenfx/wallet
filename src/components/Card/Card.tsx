import type { FC, PropsWithChildren } from 'react';

import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Touchable } from '@/components/Touchable';

type CardProps = {
  onPress?: () => void;
  size?: 'large';
};

export const Card: FC<PropsWithChildren & CardProps> = ({ children, onPress, size }) => {
  const style = [size === 'large' ? styles.large : styles.small, styles.container];

  if (onPress) {
    return (
      <Touchable onPress={onPress} style={style}>
        <GradientItemBackground />
        {children}
      </Touchable>
    );
  }

  return (
    <View style={style}>
      <GradientItemBackground />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    flex: 1,
    overflow: 'hidden',
  },
  small: {
    padding: 16,
  },
  large: {
    padding: 24,
  },
});
