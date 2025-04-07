import noop from 'lodash/noop';
import { View } from 'react-native';

import { PeriodSwitcher } from './PeriodSwitcher';

import type { Meta, StoryObj } from '@storybook/react';

const PeriodSwitcherMeta: Meta<typeof PeriodSwitcher> = {
  title: 'PeriodSwitcher',
  component: PeriodSwitcher,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default PeriodSwitcherMeta;

export const Basic: StoryObj<typeof PeriodSwitcher> = {
  args: {
    onChange: noop,
  },
};
