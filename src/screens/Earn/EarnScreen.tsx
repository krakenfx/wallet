import { GradientScreenView } from '@/components/Gradients';

import { navigationStyle } from '@/utils/navigationStyle';

import { HomeHeaderAccountSwitch } from '../Home/components/HomeHeaderAccountSwitch';
import { HomeHeaderRight } from '../Home/components/HomeHeaderRight';

import { DefiFlatList } from './components/DefiFlatList/DefiFlatList';
import { AssetsListWithNetworkFilterContextProvider } from './context/AssetsListWithNetworkFilterContext';
import { EarnErrorsContextProvider } from './context/EarnErrorsContext';

export const EarnScreen = () => {
  return (
    <GradientScreenView testID="EarnScreen">
      <EarnErrorsContextProvider>
        <AssetsListWithNetworkFilterContextProvider>
          <DefiFlatList />
        </AssetsListWithNetworkFilterContextProvider>
      </EarnErrorsContextProvider>
    </GradientScreenView>
  );
};

EarnScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerTitle: () => '',
  headerRight: () => <HomeHeaderRight />,
  headerLeft: () => <HomeHeaderAccountSwitch />,
});
