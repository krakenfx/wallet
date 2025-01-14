import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { OverlappingCollection } from '@/components/OverlappingCollection';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';

import { navigationStyle } from '@/utils/navigationStyle';

import type { OnboardingNavigationProps } from './OnboardingRouter';

import loc from '/loc';

const ICON_SIZE = 45;

export const OnboardingImportSubWalletsSuccessScreen = ({ navigation, route }: OnboardingNavigationProps<'OnboardingImportSubWalletsSuccess'>) => {
  const { subWalletIndexes } = route.params;
  const subWalletsCount: number = subWalletIndexes.length;
  const icons = subWalletIndexes.map((id, index) => <AvatarIcon accountNumber={id} accountAvatar={null} avatarSize={ICON_SIZE} key={index} />);
  const { colors } = useTheme();

  const onPress = () => {
    navigation.navigate(Routes.OnboardingSecureWallet);
  };

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <OverlappingCollection
          itemSize={ICON_SIZE}
          items={icons}
          itemsToShow={4}
          maskedItemOffset={18}
          hasMoreCountProps={{ backgroundColor: colors.purple_40, fontSize: 15 }}
        />
        <View style={styles.textContainer}>
          <Label type="boldDisplay3" style={[styles.title, styles.text]}>
            {subWalletsCount === 1
              ? loc.onboardingImportSubWallets.importSubWalletsSuccess.titleOneWallet
              : loc.formatString(loc.onboardingImportSubWallets.importSubWalletsSuccess.title, { subWalletsCount })}
          </Label>
          <Label type="regularBody" color="light75" style={styles.text}>
            {subWalletsCount === 1
              ? loc.onboardingImportSubWallets.importSubWalletsSuccess.subtitleOneWallet
              : loc.onboardingImportSubWallets.importSubWalletsSuccess.subtitle}
          </Label>
        </View>
        <FloatingBottomButtons
          primary={{
            onPress,
            text: loc.onboardingImportSubWallets.importSubWalletsSuccess.continue,
          }}
        />
      </View>
    </GradientScreenView>
  );
};

OnboardingImportSubWalletsSuccessScreen.navigationOptions = navigationStyle({
  headerBackVisible: false,
  headerLeft: () => null,
  headerTransparent: true,
  title: '',
  gestureEnabled: false,
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 80,
    gap: 10,
  },
  textContainer: {
    gap: 4,
    paddingTop: 24,
    paddingHorizontal: 64,
  },
  title: {
    marginBottom: 4,
  },
  text: {
    textAlign: 'center',
  },
});
