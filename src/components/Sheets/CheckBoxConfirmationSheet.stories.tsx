import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';

import { View } from 'react-native';

import { runAfterUISync } from '@/utils/runAfterUISync';

import { BottomSheetModalRef } from '../BottomSheet';

import { CheckBoxConfirmationSheet } from './';

import type { Meta, StoryObj } from '@storybook/react';

const CheckBoxConfirmationSheetMeta: Meta<typeof CheckBoxConfirmationSheet> = {
  title: 'Sheets/CheckBoxConfirmationSheet',
  component: CheckBoxConfirmationSheet,
  decorators: [
    Story => {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Story />
        </View>
      );
    },
  ],
  render: function Render(args) {
    const ref = useRef<BottomSheetModalRef>(null);

    useEffect(() => {
      runAfterUISync(() => {
        ref.current?.present();
      });
    }, []);

    return <CheckBoxConfirmationSheet ref={ref} {...args} />;
  },
};

export default CheckBoxConfirmationSheetMeta;

export const Basic: StoryObj<typeof CheckBoxConfirmationSheet> = {
  args: {
    title: 'Lorem Ipsum',
    checkBoxLabels: ['Lorem', 'Ipsum'],
    confirmButtonProps: {
      text: 'Confirm',
      onPress: noop,
    },
    cancelButtonProps: {
      text: 'Cancel',
      onPress: noop,
    },
  },
};
