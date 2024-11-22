import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { IconButton } from '@/components/IconButton';

import { useBrowserAnimationContext } from '../../context/BrowserAnimationContext';
import { useBrowserContext } from '../../context/BrowserContext';
import { useSearchContext } from '../../context/SearchContext';

export const BrowserGoBackButton = () => {
  const { shouldRunAnimations, animatedButtonStyle, onAnimateTransition } = useBrowserAnimationContext();
  const { showSearchBar, changeSearchValue } = useSearchContext();
  const { onExitBrowser } = useBrowserContext();

  const onPressGoBackButton = () => {
    if (!shouldRunAnimations || !showSearchBar) {
      onExitBrowser();
      return;
    }

    changeSearchValue('');
    onAnimateTransition();
  };

  return (
    <Animated.View style={[styles.backButton, animatedButtonStyle]}>
      <IconButton name="close" size={20} onPress={onPressGoBackButton} testID="BrowserGoBackButton" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
  },
});
