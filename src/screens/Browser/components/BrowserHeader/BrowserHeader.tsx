import type { SharedValue } from 'react-native-reanimated';

import React from 'react';
import { StyleSheet, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Touchable } from '@/components/Touchable';

import { useTheme } from '@/theme/themes';

import { Sizes } from '../../BrowserScreen.constants';
import { useBrowserContext } from '../../context/BrowserContext';

import { useSearchContext } from '../../context/SearchContext';

import { BrowserGoBackButton } from '../BrowserGoBackButton';
import { BrowserSearchInput } from '../BrowserSearchInput';
import { BrowserUrlWithActions } from '../BrowserUrlWithActions';

import { useBarStyle } from './useBarStyle';

const BASE_PADDING_TOP = 5;
interface BrowserHeaderProps {
  headerExpanded: SharedValue<boolean>;
  onExpandHeader: () => void;
}

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({ headerExpanded, onExpandHeader }) => {
  const insets = useSafeAreaInsets();

  const { colors } = useTheme();

  const { cleanUrl } = useBrowserContext();

  const { showSearchBar } = useSearchContext();

  const searchBarStyle = useBarStyle(headerExpanded, { isExpanded: true, expandedHeight: 45 });
  const summaryBarStyle = useBarStyle(headerExpanded, { isExpanded: false, expandedHeight: 18 });

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top + BASE_PADDING_TOP }]}>
      {}
      <Animated.View style={[styles.viewWrapper, searchBarStyle]}>
        {showSearchBar ? <BrowserSearchInput /> : <BrowserUrlWithActions />}

        <BrowserGoBackButton />
      </Animated.View>

      {}
      <Animated.View style={summaryBarStyle}>
        <Touchable style={styles.collapsedBarContainer} onPress={onExpandHeader}>
          <Text style={{ color: colors.light100 }}>{cleanUrl}</Text>
        </Touchable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.Space.s1,
    paddingBottom: 15,
    width: '100%',
    height: 'auto',
  },
  viewWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  collapsedBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
  },
});
