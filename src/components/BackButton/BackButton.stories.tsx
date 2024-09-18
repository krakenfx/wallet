import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../Button';

import { BackButton } from './BackButton';

import type { Meta, StoryObj } from '@storybook/react';

const Stack = createNativeStackNavigator();

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

const BackButtonMeta: Meta<typeof BackButton> = {
  title: 'BackButton',
  component: BackButton,
  decorators: [
    Story => {
      const RenderedStory = () => (
        <View style={{ ...styles.defaultView, alignItems: 'center' }}>
          <Story />
        </View>
      );

      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen options={{ navigationBarHidden: true }} name="First Screen" component={FirstScreen} />
          <Stack.Screen options={{ navigationBarHidden: true }} name="Second Screen" component={RenderedStory} />
        </Stack.Navigator>
      );
    },
  ],
};

export default BackButtonMeta;

export const Basic: StoryObj<typeof BackButton> = {};

export const Custom: StoryObj<typeof BackButton> = {
  name: 'Custom Button',
  args: {
    size: 16,
    blurred: true,
    backgroundColor: 'kraken',
  },
};

const styles = StyleSheet.create({
  defaultView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 30,
    padding: 30,
  },
  text: {
    color: 'white',
  },
});
