import { GradientScreenView } from '@/components/Gradients';
import { navigationStyle } from '@/utils/navigationStyle';

import { ImportSubWallets } from './ImportSubWallets';
import { LoadingSubWallets } from './LoadingSubWallets';
import { useFetchSubWallets } from './useFetchSubWallets';

export const OnboardingImportSubWalletsScreen = () => {
  const { isLoadingSubWallets, subWallets } = useFetchSubWallets();

  return (
    <GradientScreenView>
      {isLoadingSubWallets ? <LoadingSubWallets subWalletsCount={subWallets.length} /> : <ImportSubWallets subWallets={subWallets} />}
    </GradientScreenView>
  );
};

OnboardingImportSubWalletsScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
