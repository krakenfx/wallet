import type { ReactNode } from 'react';

import { StyleSheet, View } from 'react-native';

type Props = { items: ReactNode[]; offsetSize: number };



export const OverlappingList = ({ items, offsetSize }: Props) => {
  const itemsLength = items.length;
  const itemsLengthExcludeLast = itemsLength - 1;
  const offsetSize_ = offsetSize * -1;

  return (
    <View style={[styles.container, { marginLeft: itemsLengthExcludeLast * offsetSize_ }]}>
      {items.map((item, i) => {
        const isLastItem = i === itemsLength - 1;

        return (
          <View key={i.toString()} style={[styles.item, !isLastItem && { right: (itemsLengthExcludeLast - i) * offsetSize_ }]}>
            {item}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  item: {
    position: 'relative',
  },
});
