import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const ActivityIndicatorView = () => (
  <View style={styles.loadingWrapper}>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
