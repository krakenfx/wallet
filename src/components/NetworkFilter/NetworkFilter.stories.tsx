import { View } from 'react-native';

import { NetworkFilter, useNetworkFilter } from './';

import type { Meta, StoryObj } from '@storybook/react';

const NetworkFilterMeta: Meta<typeof NetworkFilter> = {
  title: 'NetworkFilter',
  component: NetworkFilter,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    const [networkFilter, setNetworkFilter] = useNetworkFilter();
    return <NetworkFilter {...args} networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} />;
  },
};

export default NetworkFilterMeta;

type Story = StoryObj<typeof NetworkFilter>;

export const Basic: Story = {
  args: {
    withBtcAndDoge: true,
  },
};
