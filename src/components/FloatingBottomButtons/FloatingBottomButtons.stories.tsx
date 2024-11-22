import { noop } from 'lodash';

import { View } from 'react-native';

import { FloatingBottomButtons } from './FloatingBottomButtons';

import type { Meta, StoryObj } from '@storybook/react';

type FloatingBottomButtonsPropsAndCustomArgs = React.ComponentProps<typeof FloatingBottomButtons> & { showSecondaryButton: boolean };

const FloatingBottomButtonsMeta: Meta<FloatingBottomButtonsPropsAndCustomArgs> = {
  title: 'FloatingBottomButtons',
  component: FloatingBottomButtons,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ showSecondaryButton, secondary, ...rest }) {
    return <FloatingBottomButtons {...rest} secondary={showSecondaryButton ? secondary : undefined} />;
  },
};

export default FloatingBottomButtonsMeta;

type Story = StoryObj<FloatingBottomButtonsPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    primary: {
      color: 'kraken',
      textColor: 'light100',
      text: 'Lorem Ipsum',
      onPress: noop,
    },
    secondary: {
      color: 'grey500',
      text: 'Dolor Sit',
      onPress: noop,
    },
    showSecondaryButton: false,
  },
};
