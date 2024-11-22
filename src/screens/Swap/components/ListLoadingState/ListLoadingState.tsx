import { times } from 'lodash';

import { StyleSheet, View } from 'react-native';

import { AssetPlaceholer } from '../AssetPlaceholder';

type Props = {
  placeholderCount: number;
};

export const ListLoadingState = ({ placeholderCount }: Props) => {
  return (
    <View style={styles.placeholderContainer}>
      {times(placeholderCount).map((_, i) => (
        <AssetPlaceholer key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    gap: 20,
    paddingHorizontal: 8,
  },
});
