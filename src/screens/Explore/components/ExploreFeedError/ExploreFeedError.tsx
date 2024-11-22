import { Image, StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';

import { Sizes } from '../../ExploreScreen.constants';

import loc from '/loc';

export const ExploreFeedError = () => {
  return (
    <GradientScreenView>
      <View style={styles.container}>
        <Image source={require('@/assets/images/common/exclamation.png')} />
        <View style={styles.textWrapper}>
          <Label type="boldTitle0" style={styles.centeredText}>
            {loc.explore.errorTitle}
          </Label>
          <Label type="regularBody" color="light75" style={styles.centeredText}>
            {loc.explore.errorBody}
          </Label>
        </View>
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.Space.s8,
  },
  textWrapper: {
    paddingHorizontal: 36,
    gap: 8,
    marginBottom: 24,
  },
  centeredText: {
    textAlign: 'center',
  },
});
