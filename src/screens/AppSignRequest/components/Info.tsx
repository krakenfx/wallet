import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  cells: (ReactElement | undefined)[];
};

export const Info = ({ cells }: Props) => {
  return <View style={styles.container}>{cells}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 12,
    justifyContent: 'space-between',
  },
});
