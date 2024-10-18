import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { SvgIcon } from '@/components/SvgIcon';
import { useSearchContext } from '@/screens/Browser/context/SearchContext';
import { useTheme } from '@/theme/themes';

import { useBrowserContext } from '../../context/BrowserContext';

import { BrowserQuickActionsButton } from '../BrowserQuickActionsButton/BrowserQuickActionsButton';

export const BrowserUrlWithActions = () => {
  const { colors } = useTheme();

  const { cleanUrl, isConnectedToDapp, navigationState, error, onNavigateBack, onNavigateForward } = useBrowserContext();

  const { handleShowSearch } = useSearchContext();

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.dark25 }]}>
      {}
      <View style={styles.navigationButtonContainer}>
        <SvgIcon size={24} name="chevron-left" color={navigationState.canNavigateBack ? 'light50' : 'light15'} onPress={onNavigateBack} />
        <SvgIcon size={24} name="chevron-right" color={navigationState.canNavigateForward ? 'light50' : 'light15'} onPress={onNavigateForward} />
      </View>

      {}
      <TouchableWithoutFeedback onPress={handleShowSearch}>
        <View style={styles.mainWrapper} testID="BrowserSearchBarUrlWithActions">
          {!error && <SvgIcon name="lock" color="light50" size={16} />}

          <Text style={{ color: colors.light100 }}>{cleanUrl}</Text>

          {isConnectedToDapp ? <SvgIcon name="plug-connected" color="light50" size={16} /> : <SvgIcon name="plug-disconnected" color="light15" size={16} />}
        </View>
      </TouchableWithoutFeedback>

      {}
      <BrowserQuickActionsButton />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
    gap: 4,
    height: 45,
    borderRadius: 13,
    padding: 12,
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    flex: 1,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});