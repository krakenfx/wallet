import { useEffect } from 'react';
import { View } from 'react-native';

import { useSharedValue, withTiming } from 'react-native-reanimated';

import { colorsControl } from '@/utils/storybook';

import { AnimatedProgressCircle } from './AnimatedProgessCircle';

import type { Meta, StoryObj } from '@storybook/react';

const AnimatedProggressCircleMeta: Meta<typeof AnimatedProgressCircle> = {
  title: 'AnimatedProgressCircle',
  component: AnimatedProgressCircle,
  decorators: [
    Story => (
      <View style={{ alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export default AnimatedProggressCircleMeta;

export const Basic: StoryObj<typeof AnimatedProgressCircle> = {
  args: {
    size: 40,
    strokeWidth: 4,
    color: 'light75',
    backgroundColor: 'purple_40',
  },
  argTypes: {
    color: colorsControl,
    backgroundColor: colorsControl,
    size: { control: { type: 'number' } },
    strokeWidth: { control: { type: 'number' } },
  },
  render: function Render(props) {
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withTiming(1, { duration: 10 * 1000 });
    }, [progress]);

    return <AnimatedProgressCircle {...props} progress={progress} />;
  },
};
