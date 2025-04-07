import { View } from 'react-native';

import { CriticalWarningBackground } from './CriticalWarningBackground';

import type { Meta, StoryObj } from '@storybook/react';

const CriticalWarningBackgroundMeta: Meta<typeof CriticalWarningBackground> = {
  title: 'CriticalWarningBackground',
  component: CriticalWarningBackground,
  decorators: [
    Story => (
      <View>
        <Story />
      </View>
    ),
  ],
};

export default CriticalWarningBackgroundMeta;

export const Basic: StoryObj<typeof CriticalWarningBackground> = {};
