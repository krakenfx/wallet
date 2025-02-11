import { View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { baseViewStyle } from '@/utils/storybook';

import { CircleIcon } from './CircleIcon';

import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const font = require('src/components/SvgIcon/selection.json');

const ICON_NAMES: string[] = font.icons
  .map((i: { icon: { tags: string[] } }) => {
    return i.icon.tags[0];
  })
  .filter((name: string) => !name.startsWith('small-'));

const CircleIconMeta: Meta<typeof CircleIcon> = {
  title: 'CircleIcon',
  component: CircleIcon,
  argTypes: {
    backgroundColor: {
      options: Object.keys(SuperDarkTheme.colors),
      control: { type: 'select' },
    },
    name: {
      options: ICON_NAMES,
      control: { type: 'select' },
    },
    size: {
      control: { type: 'number', min: 12, max: 120, step: 6 },
    },
    iconSize: {
      control: { type: 'number', min: 6, max: 64, step: 2 },
    },
  },
  decorators: [
    Story => (
      <View style={[baseViewStyle.view, { alignItems: 'center' }]}>
        <Story />
      </View>
    ),
  ],
};

export default CircleIconMeta;

export const Basic: StoryObj<typeof CircleIcon> = {
  args: {
    name: 'kraken',
    backgroundColor: 'kraken',
    size: 40,
    iconSize: 20,
  },
};
