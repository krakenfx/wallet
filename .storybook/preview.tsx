import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { StyleSheet, View } from 'react-native';
import type { Preview } from '@storybook/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SuperDarkTheme } from '../src/theme/themes';

RNBootSplash.hide();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SuperDarkTheme.colors.background,
    justifyContent: 'center',
  },
});

const preview: Preview = {
  decorators: [
    Story => (
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <NavigationContainer theme={SuperDarkTheme}>
            <BottomSheetModalProvider>
              <View style={styles.container}>
                <Story />
              </View>
            </BottomSheetModalProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default preview;
