import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';

import lottieSource from '../assets/loadingSubWalletsAnimation.json';

import loc from '/loc';

type Props = { subWalletsCount: number };

export const LoadingSubWallets = ({ subWalletsCount }: Props) => {
  return (
    <View style={styles.container}>
      <LottieView source={lottieSource} autoPlay loop style={styles.lottie} />
      <View style={styles.textContainer}>
        <Label type="boldDisplay5" style={[styles.title, styles.text]}>
          {loc.onboardingImportSubWallets.loadingSubWallets.title}
        </Label>
        <Label type="mediumCaption1" color="light50" style={styles.text}>
          {loc.onboardingImportSubWallets.loadingSubWallets.subtitle}
        </Label>
        {subWalletsCount === 1 && (
          <Label type="mediumBody" color="light75" entering={FadeIn} style={styles.text}>
            {loc.onboardingImportSubWallets.loadingSubWallets.foundWalletsOne}
          </Label>
        )}
        {subWalletsCount > 1 && (
          <Label type="mediumBody" color="light75" entering={FadeIn} style={styles.text}>
            {loc.formatString(loc.onboardingImportSubWallets.loadingSubWallets.foundWallets, { subWalletsCount })}
          </Label>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 80,
    gap: 10,
  },
  lottie: {
    height: 160,
    width: 190,
  },
  textContainer: {
    gap: 4,
  },
  title: {
    marginBottom: 4,
  },
  text: {
    textAlign: 'center',
  },
});
