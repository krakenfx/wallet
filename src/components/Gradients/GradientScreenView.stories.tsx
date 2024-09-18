import React from 'react';

import { View } from 'react-native';

import { GradientScreenView } from './GradientScreenView';

import type { Meta, StoryObj } from '@storybook/react';

const GradientScreenViewMeta: Meta<typeof GradientScreenView> = {
  title: 'Gradients/GradientScreenView',
  component: GradientScreenView,
};

export default GradientScreenViewMeta;

export const Basic: StoryObj<typeof GradientScreenView> = {
  render: function Render() {
    return (
      <GradientScreenView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }} />
      </GradientScreenView>
    );
  },
};
