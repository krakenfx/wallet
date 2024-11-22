import { View } from 'react-native';

import { AddressDisplay } from '@/components/AddressDisplay';

import type { Meta, StoryObj } from '@storybook/react';

const AddressDisplayMeta: Meta<typeof AddressDisplay> = {
  title: 'AddressDisplay',
  component: AddressDisplay,
  argTypes: {
    style: {
      control: {
        type: 'object',
      },
      defaultValue: {},
    },
    containerStyle: { control: { type: 'object' }, defaultValue: {} },
    textStyle: {
      control: { type: 'object' },
      defaultValue: {},
    },
  },
  decorators: [
    Story => (
      <View
        style={{
          padding: 30,
        }}>
        <Story />
      </View>
    ),
  ],
};

export default AddressDisplayMeta;

export const Basic: StoryObj<typeof AddressDisplay> = {
  args: {
    address: '0x0000000000000000000000000000000000000000',
    stringToCopy: '',
    boldPrefix: true,
    hasSpaces: true,
    showButton: true,
    ensName: 'Ens Name',
    showEnsNameOnly: false,
    anyNumberOfLines: false,
    style: {},
    containerStyle: {},
    textStyle: {},
  },
};
