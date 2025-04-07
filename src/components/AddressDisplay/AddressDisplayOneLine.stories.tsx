import { View } from 'react-native';

import { AddressDisplayOneLine } from '@/components/AddressDisplay';

import type { Meta, StoryObj } from '@storybook/react';

const AddressDisplayOneLineMeta: Meta<typeof AddressDisplayOneLine> = {
  title: 'AddressDisplayOneLine',
  component: AddressDisplayOneLine,
  decorators: [
    Story => (
      <View
        style={{
          padding: 60,
          justifyContent: 'center',
          flex: 1,
        }}>
        <Story />
      </View>
    ),
  ],
};

export default AddressDisplayOneLineMeta;

export const Basic: StoryObj<typeof AddressDisplayOneLine> = {
  args: {
    address: '0x0000000000000000000000000000000000000000',
  },
};
