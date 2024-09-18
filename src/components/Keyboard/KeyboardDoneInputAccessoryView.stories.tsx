import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { SpecificPlatformOnlyStory } from '@/utils/storybook';

import { KeyboardDoneInputAccessoryView } from './';

import type { Meta, StoryObj } from '@storybook/react';

const KeyboardDoneInputAccessoryViewMeta: Meta<typeof KeyboardDoneInputAccessoryView> = {
  title: 'Keyboard/KeyboardDoneInputAccessoryView',
  component: KeyboardDoneInputAccessoryView,
  render: function Render() {
    if (Platform.OS !== 'ios') {
      return <SpecificPlatformOnlyStory platform="ios" />;
    }

    return (
      <View style={{ justifyContent: 'center' }}>
        <TextInput
          placeholder="Lorem Ipsum"
          style={styles.input}
          placeholderTextColor={SuperDarkTheme.colors.light50}
          inputAccessoryViewID={KeyboardDoneInputAccessoryView.InputAccessoryViewID}
        />
        <KeyboardDoneInputAccessoryView />
      </View>
    );
  },
};

export default KeyboardDoneInputAccessoryViewMeta;

type Story = StoryObj<typeof KeyboardDoneInputAccessoryView>;

export const Basic: Story = {};

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 30,
    borderWidth: 1,
    backgroundColor: SuperDarkTheme.colors.coreBackground,
    borderColor: SuperDarkTheme.colors.kraken,
    color: SuperDarkTheme.colors.light100,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
  },
});
