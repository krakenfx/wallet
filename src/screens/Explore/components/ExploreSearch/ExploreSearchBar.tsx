import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

import { useTheme } from '@/theme/themes';

import { useExploreAnimationContext } from '../../context/ExploreAnimationContext';
import { Sizes } from '../../ExploreScreen.constants';

import loc from '/loc';

export const ExploreSearchBar = () => {
  const { colors } = useTheme();

  const { searchBarContainerRef, searchBarContentRef, searchBarAnimatedContainerStyle, searchBarAnimatedContentStyle, openLinkWithTransition } =
    useExploreAnimationContext();

  const onPress = () => openLinkWithTransition();

  return (
    <Touchable onPress={onPress}>
      <Animated.View ref={searchBarContainerRef} style={[styles.inputContainer, searchBarAnimatedContainerStyle, { backgroundColor: colors.dark25 }]}>
        <Animated.View ref={searchBarContentRef} style={[styles.inputContent, searchBarAnimatedContentStyle]}>
          <SvgIcon name="search" size={18} color="light50" style={styles.icon} />

          <Label type="regularBody" color="light50">
            {loc.browser.searchOnChain}
          </Label>
        </Animated.View>
      </Animated.View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: Sizes.Space.s2,
    borderRadius: 16,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});
