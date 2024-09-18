import { noop } from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { baseViewStyle } from '@/utils/storybook';

import { SizeAwareSVGUri } from './';

import type { Meta, StoryObj } from '@storybook/react';

const SizeAwareSVGUriMeta: Meta<typeof SizeAwareSVGUri> = {
  title: 'SizeAwareSVGUri',
  component: SizeAwareSVGUri,
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
  render: function Render(args) {
    return (
      <View style={{ height: 80, width: 80, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <SizeAwareSVGUri {...args} />
      </View>
    );
  },
};

export default SizeAwareSVGUriMeta;

type Story = StoryObj<typeof SizeAwareSVGUri>;

export const Basic: Story = {
  args: {
    height: 70,
    width: 70,
    uri: 'https://assets-cms.kraken.com/images/51n36hrp/facade/930f097495c8802dfcd23a58b8e8f1015e867efc-464x464.svg',
    fillContainer: false,
    onLoad: noop,
  },
};
