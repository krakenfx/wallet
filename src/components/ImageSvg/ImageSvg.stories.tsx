import { View } from 'react-native';

import { ImageSvg } from './ImageSvg';

import type { Meta, StoryObj } from '@storybook/react';

const ImageSvgMeta: Meta<typeof ImageSvg> = {
  title: 'ImageSvg',
  component: ImageSvg,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ImageSvgMeta;

type Story = StoryObj<typeof ImageSvg>;

export const Basic: Story = {
  args: {
    uri: 'https://assets-cms.kraken.com/images/51n36hrp/facade/930f097495c8802dfcd23a58b8e8f1015e867efc-464x464.svg',
    style: {
      backgroundColor: 'white',
    },
    fallbackIconSize: 50,
    width: 160,
    height: 160,
  },
};

export const WithFailedImageLoad: Story = {
  args: {
    uri: '',
    style: {
      backgroundColor: 'white',
    },
    fallbackIconSize: 50,
    width: 160,
    height: 160,
  },
};
