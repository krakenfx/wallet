import { Image, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import { Label } from '@/components/Label';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';

import loc from '/loc';


export const BrowserNoSearch = () => {
  const { noSearchViewStyle } = useBrowserAnimationContext();

  return (
    <Animated.View style={[styles.container, noSearchViewStyle]}>
      <Image style={styles.image} source={require('@/assets/images/common/search.png')} />

      <Label type="regularTitle1" color="light100">
        {loc.browser.noSearch.title}
      </Label>

      <Label type="regularBody" color="light75">
        {loc.browser.noSearch.description}
      </Label>
    </Animated.View>
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
