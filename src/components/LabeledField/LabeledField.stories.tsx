import React from 'react';
import { Text, View } from 'react-native';

import { LabeledField } from './LabeledField';

import type { Meta, StoryObj } from '@storybook/react';

type LabeledFieldPropsAndCustomArgs = React.ComponentProps<typeof LabeledField> & {
  showRightItem: boolean;
  showChildren: boolean;
};

const LabeledFieldMeta: Meta<LabeledFieldPropsAndCustomArgs> = {
  title: 'LabeledField',
  component: LabeledField,
  decorators: [
    Story => (
      <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ showRightItem, showChildren, ...args }) {
    return (
      <LabeledField
        {...args}
        right={
          showRightItem ? (
            <View>
              <Text style={{ color: 'white' }}>Right item</Text>
            </View>
          ) : null
        }>
        {showChildren ? (
          <View>
            <Text style={{ color: 'white' }}>Children component text</Text>
          </View>
        ) : null}
      </LabeledField>
    );
  },
};

export default LabeledFieldMeta;

type Story = StoryObj<LabeledFieldPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    label: 'This is a label',
    showRightItem: false,
    showChildren: true,
  },
};
