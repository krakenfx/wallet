import { useState } from 'react';
import { Text, View } from 'react-native';

import { ToggleRow } from './';

import type { Meta, StoryObj } from '@storybook/react';

interface Option {
  id: number;
  text: string;
}

const OPTIONS: Option[] = [
  { id: 1, text: 'First Option' },
  { id: 2, text: 'Second Option' },
  { id: 3, text: 'Third Option' },
  { id: 4, text: 'Fourth Option' },
];

const ToggleRowMeta: Meta<typeof ToggleRow> = {
  title: 'ToggleRow',
  component: ToggleRow,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render() {
    const [selected, setSelected] = useState<Option>();

    return (
      <View>
        {OPTIONS.map(option => {
          return (
            <ToggleRow key={option.id} onPress={() => setSelected(option)} selected={option.id === selected?.id}>
              <Text style={{ color: 'white' }}>{option.text}</Text>
            </ToggleRow>
          );
        })}
      </View>
    );
  },
};

export default ToggleRowMeta;

type Story = StoryObj<typeof ToggleRow>;

export const Basic: Story = {};
