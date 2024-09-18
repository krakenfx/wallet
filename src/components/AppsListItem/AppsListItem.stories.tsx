import React from 'react';
import { View } from 'react-native';

import { networkControl } from '@/utils/storybook';

import { SvgIcon } from '../SvgIcon';

import { AppsListItem } from './AppsListItem';

import type { Meta, StoryObj } from '@storybook/react';

type AppsListItemPropsAndCustomArgs = React.ComponentProps<typeof AppsListItem> & { showRightElement: boolean };

const AppsListItemMeta: Meta<AppsListItemPropsAndCustomArgs> = {
  title: 'AppsListItem',
  component: AppsListItem,
  argTypes: {
    network: networkControl,
    iconMaskShape: {
      options: ['circle', 'rounded-square'],
      control: { type: 'select' },
    },
  },
  render: ({ showRightElement, ...args }) => {
    return <AppsListItem {...args} rightElement={showRightElement ? <SvgIcon name="open-external" /> : undefined} />;
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, padding: 30 }}>
        <Story />
      </View>
    ),
  ],
};

export default AppsListItemMeta;

type Story = StoryObj<AppsListItemPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    name: 'Blast',
    network: 'blast',
    iconMaskShape: 'circle',
    iconUri: 'https://i.seadn.io/gcs/files/cd2cae80377e3d0f19d0e7254219503d.png?auto=format&dpr=1&w=100',
    onPress: () => {},
    showRightElement: true,
  },
};
