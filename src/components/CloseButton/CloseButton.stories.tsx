import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { colorsControl } from '@/utils/storybook';

import { Button } from '../Button';

import { CloseButton } from './CloseButton';

import type { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';

import type { Meta, StoryObj } from '@storybook/react';

const Stack = createNativeStackNavigator();

const CloseButtonMeta: Meta<typeof CloseButton> = {
  title: 'CloseButton',
  component: CloseButton,
  argTypes: {
    backgroundColor: colorsControl,
  },
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default CloseButtonMeta;

export const Basic: StoryObj<typeof CloseButton> = {
  args: {
    backgroundColor: 'kraken',
  },
  render: function Render(args) {
    const [showPar, setShowPar] = useState(true);

    const onHide = () => setShowPar(false);

    return (
      <View style={{ flexDirection: 'column', gap: 20 }}>
        <CloseButton {...args} onPress={onHide} />
        <View style={{ height: 150 }}>
          {showPar && (
            <Text style={{ color: SuperDarkTheme.colors.light75, backgroundColor: SuperDarkTheme.colors.purple_40, textAlign: 'center', padding: 50 }}>
              Click the close button above to hide this paragraph.
            </Text>
          )}
        </View>
      </View>
    );
  },
};

export const UsedAsGoBackButton: StoryObj<typeof CloseButton> = {
  args: {
    goBackOnly: true,
    backgroundColor: 'kraken',
  },
  render: function Render(args) {
    const RenderedStory = () => (
      <View style={{ ...styles.defaultView, alignItems: 'center' }}>
        <CloseButton {...args} />
      </View>
    );

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen options={{ navigationBarHidden: true }} name="First Screen" component={FirstScreen} />
        <Stack.Screen options={{ navigationBarHidden: true }} name="Second Screen" component={RenderedStory} />
      </Stack.Navigator>
    );
  },
};

const FirstScreen: React.FC<{ navigation: NativeStackNavigationHelpers }> = ({ navigation }) => {
  return (
    <View style={styles.defaultView}>
      <Button text="Navigate to other screen" icon="chevron-right" onPress={() => navigation.navigate('Second Screen')} />
      <Text style={styles.text}>
        To test this component you will first need to navigate to another screen in the navigation stack first. We are doing this because without at least two
        screen, it is not possible to test the back button scenario. Click on the button above, then navigate back from the next screen.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 30,
  },
  text: {
    color: 'white',
  },
});
