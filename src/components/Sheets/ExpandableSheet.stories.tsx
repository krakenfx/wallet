import { noop } from 'lodash';
import React, { useRef } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../Button';
import { FloatingBottomButtons } from '../FloatingBottomButtons';

import { ExpandableSheet, type ExpandableSheetMethods } from './';

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
            <Text style={styles.text}>Lorem ipsum.</Text>
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
            <Text style={styles.text}>Lorem ipsum dolor sit amet consectetur, adipisicing elit</Text>
          </View>
        }
      />
    );
  },
};

export const Modal: StoryObj<ExpandableSheetPropsAndCustomArgs> = {
  args: {
    showSecondaryButton: false,
    isModal: true,
    dismissible: false,
    extraPaddingBottom: 0,
    onDismiss: noop,
  },
  render: function Render({ showSecondaryButton, ...args }) {
    const expandableSheetRef = useRef<ExpandableSheetMethods>(null);

    return (
      <>
        <Button style={styles.button} text="Show modal" onPress={() => expandableSheetRef.current?.expand()} />
        <ExpandableSheet
          {...args}
          ref={expandableSheetRef}
          PreviewComponent={
            <View style={styles.textView}>
              <Text style={styles.text}>Lorem ipsum.</Text>
            </View>
          }
          FloatingButtonsComponent={
            <View>
              <FloatingBottomButtons noAbsolutePosition primary={{ text: 'Primary' }} secondary={showSecondaryButton ? { text: 'Secondary' } : undefined} />
            </View>
          }
          DetailsComponent={
            <View style={styles.textView}>
              <Text style={styles.text}>Lorem ipsum dolor sit amet consectetur, adipisicing elit</Text>
            </View>
          }
        />
      </>
    );
  },
};

const styles = StyleSheet.create({
  button: {
    margin: 24,
  },
  textView: {
    padding: 20,
  },
  text: {
    color: 'white',
  },
  floatingButtons: {
    padding: 20,
  },
});
