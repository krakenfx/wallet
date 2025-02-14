import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import type { Preview } from '@storybook/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { SecuredRealmProvider } from '../src/realm/SecuredRealmProvider';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SuperDarkTheme } from '../src/theme/themes';

RNBootSplash.hide();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Storybook seems to override StatusBar translucent settings resulting in mismatch in available window height compared to the app
    ...Platform.select({
      android: {
        marginTop: -(StatusBar.currentHeight ?? 0),
        paddingTop: StatusBar.currentHeight ?? 0,
      },
    }),
    backgroundColor: SuperDarkTheme.colors.background,
    justifyContent: 'center',
  },
});

const preview: Preview = {
  decorators: [
    Story => (
      <GestureHandlerRootView>
        <SecuredRealmProvider>
          <SafeAreaProvider>
            <NavigationContainer theme={SuperDarkTheme}>
              <BottomSheetModalProvider>
                <View style={styles.container}>
                  <Story />
                </View>
              </BottomSheetModalProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </SecuredRealmProvider>
      </GestureHandlerRootView>
    ),
  ],
};

export default preview;
