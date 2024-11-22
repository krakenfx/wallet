import { StyleSheet, Text, TextInput, View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { ToastManager } from '../Toast';

import { CopyToClipBoard } from './CopyToClipboard';

import type { Meta, StoryObj } from '@storybook/react';

const CopyToClipBoardMeta: Meta<typeof CopyToClipBoard> = {
  title: 'CopyToClipBoard',
  component: CopyToClipBoard,
  decorators: [
    Story => (
      <View style={styles.main}>
        <Story />
        <ToastManager />
      </View>
    ),
  ],
  render: function Render(args) {
    return (
      <View style={styles.storyContainer}>
        <View style={styles.clipboardContainer}>
          <CopyToClipBoard {...args}>
            <Text style={styles.text}>{args.stringToCopy}</Text>
          </CopyToClipBoard>
        </View>

        <TextInput placeholderTextColor={SuperDarkTheme.colors.dark50} style={styles.input} placeholder="Hold & paste in here" />
      </View>
    );
  },
};

export default CopyToClipBoardMeta;

export const Basic: StoryObj<typeof CopyToClipBoard> = {
  args: {
    stringToCopy: 'Lorem Ipsum',
    toastMessage: 'Text copied succesfully!',
    containerStyle: {},
    contentStyle: {
      justifyContent: 'center',
    },
  },
};

export const WithCustomIconContainer: StoryObj<typeof CopyToClipBoard> = {
  args: {
    stringToCopy: 'Lorem Ipsum',
    toastMessage: 'Text copied succesfully!',
    containerStyle: {},
    contentStyle: {
      justifyContent: 'center',
    },
    iconContainerStyle: {
      backgroundColor: SuperDarkTheme.colors.coreBackground,
      padding: 3,
      borderRadius: 30,
      height: 30,
      justifyContent: 'center',
    },
  },
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
  },
  clipboardContainer: {
    backgroundColor: SuperDarkTheme.colors.kraken,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  input: {
    color: SuperDarkTheme.colors.dark100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 40,
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
});
