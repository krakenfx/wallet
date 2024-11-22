import { View } from 'react-native';

import { SuperDarkTheme } from '@/theme/themes';

import { SvgIcon } from '../SvgIcon';

import { GradientMask } from './GradientMask';

import type { Meta, StoryObj } from '@storybook/react';

const GradientMaskMeta: Meta<typeof GradientMask> = {
  title: 'Gradients/GradientMask',
  component: GradientMask,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default GradientMaskMeta;

export const BasicOnIcon: StoryObj<typeof GradientMask> = {
  args: {
    element: <SvgIcon name="kraken" size={56} color="kraken" />,
  },
};

export const MaskedView: StoryObj<typeof GradientMask> = {
  args: {
    element: <View style={{ height: 300, width: 300, borderRadius: 20, backgroundColor: SuperDarkTheme.colors.kraken }} />,
  },
};
