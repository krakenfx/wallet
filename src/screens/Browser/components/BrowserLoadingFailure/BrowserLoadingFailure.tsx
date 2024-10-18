import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import loc from '/loc';

export const BrowserLoadingFailure = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('@/assets/images/common/exclamation.png')} />

      <Label type="regularTitle1" color="light100">
        {loc.browser.loadingError.title}
      </Label>

      <Label type="regularBody" color="light75">
        {loc.browser.loadingError.description}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    paddingTop: 90,
    paddingHorizontal: 24,
  },
  image: {
    width: 175,
    height: 175,
    marginBottom: 10,
  },
});
