import { noop } from 'lodash';

import { Text, View } from 'react-native';

import { BottomSheet } from '../BottomSheet';
import { SvgIcon } from '../SvgIcon';

import { ModalNavigationHeader } from './ModalNavigationHeader';

import type { Meta, StoryObj } from '@storybook/react';

const ModalNavigationHeaderMeta: Meta<typeof ModalNavigationHeader> = {
  title: 'ModalNavigationHeader',
  component: ModalNavigationHeader,
  decorators: [
    Story => (
      <View style={{ position: 'relative', padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    return (
      <BottomSheet snapPoints={['100%']} dismissible={false}>
        <ModalNavigationHeader {...args} />
      </BottomSheet>
    );
  },
};

export default ModalNavigationHeaderMeta;

type Story = StoryObj<typeof ModalNavigationHeader>;

export const Basic: Story = {
  args: {
    title: 'Lorem ipsum dolor',
    goBackOnly: false,
    onClosePress: noop,
  },
};

export const WithAComponentAsAChild: Story = {
  args: {
    title: (
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
        <SvgIcon name="kraken" />
        <Text style={{ color: 'white' }}>Lorem Ipsum</Text>
      </View>
    ),
    goBackOnly: false,
    onClosePress: noop,
  },
};
