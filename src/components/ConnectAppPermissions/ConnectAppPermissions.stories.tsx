import React from 'react';
import { View } from 'react-native';

import { colorsControl } from '@/utils/storybook';

import { ConnectAppPermissions } from './ConnectAppPermissions';

import type { Meta, StoryObj } from '@storybook/react';

type AppsListItemPropsAndCustomArgs = React.ComponentProps<typeof ConnectAppPermissions> & { showRightElement: boolean };

const ConnectAppPermissionsMeta: Meta<AppsListItemPropsAndCustomArgs> = {
  title: 'ConnectAppPermissions',
  component: ConnectAppPermissions,
  argTypes: {
    backgroundColor: colorsControl,
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, padding: 30 }}>
        <Story />
      </View>
    ),
  ],
};

export default ConnectAppPermissionsMeta;

type Story = StoryObj<AppsListItemPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    backgroundColor: 'kraken',
  },
};
