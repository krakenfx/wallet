import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

type Props = {
  title: string | string[];
  containerStyle?: StyleProp<ViewStyle>;
};

export const TransactionDetailItem: React.FC<PropsWithChildren & Props> = ({ title, children, containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Label type="boldCaption1" color="light50" style={styles.title}>
        {title}
      </Label>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 4,
  },
});
