import { noop } from 'lodash';

import { FadeIn } from 'react-native-reanimated';

import { BottomSheet } from '@/components/BottomSheet';

import { Label } from '../Label';

import { SimpleSlide } from './SimpleSlide';

import type { Meta, StoryObj } from '@storybook/react';

const SimpleSlideMeta: Meta<typeof SimpleSlide> = {
  title: 'AnimatedSlides/SimpleSlide',
  component: SimpleSlide,
};

export default SimpleSlideMeta;

type Story = StoryObj<typeof SimpleSlide>;

interface Args {
  title: string;
  buttonText: string;
}

const Content = () => {
  return (
    <Label type="regularTitle1" color="light75" entering={FadeIn.duration(500).delay(500)}>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio itaque, quae sequi quod maxime dolorem facere.
    </Label>
  );
};

export const WithClosablePanel: Story = {
  args: {
    title: 'A new amazing feature',
    buttonText: 'Click Me',
  },
  render: (args: Args) => (
    <BottomSheet enablePanDownToClose snapPoints={['90%']}>
      <SimpleSlide {...args} animation={require('@/assets/lottie/walletConnect-tutorial-slide1.json')} onButtonPress={noop}>
        <Content />
      </SimpleSlide>
    </BottomSheet>
  ),
};

export const WithoutClosablePanel: Story = {
  args: {
    title: 'A new amazing feature',
    buttonText: 'Click Me',
  },
  render: (args: Args) => (
    <BottomSheet enablePanDownToClose={false} snapPoints={['90%']}>
      <SimpleSlide {...args} animation={require('@/assets/lottie/walletConnect-tutorial-slide1.json')} onButtonPress={noop}>
        <Content />
      </SimpleSlide>
    </BottomSheet>
  ),
};
