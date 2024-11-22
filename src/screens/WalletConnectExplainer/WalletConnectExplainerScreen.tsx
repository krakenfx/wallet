import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { IconButton } from '@/components/IconButton';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { useSettingsMutations } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';

import { SlideFour } from './slides/SlideFour';
import { SlideOne } from './slides/SlideOne';
import { SlideThree } from './slides/SlideThree';
import { SlideTwo } from './slides/SlideTwo';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const pages = [SlideOne, SlideTwo, SlideThree, SlideFour];

export const WalletConnectExplainerScreen = ({ navigation }: NavigationProps<'WalletConnectExplainer'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { setWalletConnectExplainerTaskCompleted } = useSettingsMutations();

  useEffect(() => {
    setWalletConnectExplainerTaskCompleted();
  }, [setWalletConnectExplainerTaskCompleted]);

  const [currentPage, setCurrentPage] = useState(0);

  const handleButtonPress = useCallback(
    (direction: 'forward' | 'backward') => {
      setCurrentPage(page => {
        const nextPage = direction === 'forward' ? page + 1 : page - 1;
        return nextPage >= 0 && nextPage < pages.length ? nextPage : page;
      });
    },
    [setCurrentPage],
  );

  const onContinue = () => {
    handleButtonPress('forward');
  };

  const onBack = () => {
    handleButtonPress('backward');
  };

  const SlideComponent = pages[currentPage];

  return (
    <BottomSheet enablePanDownToClose snapPoints={useCommonSnapPoints('toHeaderTransparent')} {...bottomSheetProps}>
      <View style={styles.container} testID="WalletConnectExplainer">
        <SlideComponent onContinue={onContinue} onClose={close} />
        {currentPage > 0 && <IconButton containerStyle={styles.backButton} name="chevron-left" onPress={onBack} size={20} />}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 20,
  },
});

const navigationOptions: NativeStackNavigationOptions = {
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
};

WalletConnectExplainerScreen.navigationOptions = navigationOptions;
