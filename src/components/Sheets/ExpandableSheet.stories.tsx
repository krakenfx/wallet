import { noop } from 'lodash';
import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { FloatingBottomButtons } from '../FloatingBottomButtons';

import { ExpandableSheet } from './';

import type { Meta, StoryObj } from '@storybook/react';

type ExpandableSheetPropsAndCustomArgs = React.ComponentProps<typeof ExpandableSheet> & { showSecondaryButton: boolean };

const ExpandableSheetMeta: Meta<ExpandableSheetPropsAndCustomArgs> = {
  title: 'Sheets/ExpandableSheet',
  component: ExpandableSheet,
};

export default ExpandableSheetMeta;

export const Basic: StoryObj<ExpandableSheetPropsAndCustomArgs> = {
  args: {
    showSecondaryButton: false,
    dismissible: false,
    extraPaddingBottom: 0,
    onDismiss: noop,
  },
  render: function Render({ showSecondaryButton, ...args }) {
    return (
      <ExpandableSheet
        {...args}
        PreviewComponent={
          <View style={styles.textView}>
            <Text style={{ color: 'white' }}>Lorem ipsum.</Text>
          </View>
        }
        FloatingButtonsComponent={
          <View>
            <FloatingBottomButtons
              noAbsolutePosition
              primary={{
                text: 'Primary',
              }}
              secondary={
                showSecondaryButton
                  ? {
                      text: 'Secondary',
                    }
                  : undefined
              }
            />
          </View>
        }
        DetailsComponent={
          <View style={styles.textView}>
            <Text style={{ color: 'white' }}>Lorem ipsum dolor sit amet consectetur, adipisicing elit</Text>
          </View>
        }
      />
    );
  },
};

const styles = StyleSheet.create({
  textView: {
    padding: 20,
  },
  floatingButtons: {
    padding: 20,
  },
});
