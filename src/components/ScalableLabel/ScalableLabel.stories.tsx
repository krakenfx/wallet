import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../Button';

import { ScalableLabel } from './';

import type { Meta, StoryObj } from '@storybook/react';

const ScalableLabelMeta: Meta<typeof ScalableLabel> = {
  title: 'ScalableLabel',
  component: ScalableLabel,
  render: function Render({ scale: propScale, ...rest }) {
    const [scale, setScale] = useState<number>(propScale);

    return (
      <View style={styles.mainContainer}>
        <ScalableLabel {...rest} scale={scale} />

        <View style={styles.buttonsContainer}>
          <Button text="Scale to 1" size="large" onPress={() => setScale(1)} style={styles.button} />
          <Button text={`Scale to ${propScale}`} color="kraken" size="large" onPress={() => setScale(propScale)} style={styles.button} />
        </View>
      </View>
    );
  },
};

export default ScalableLabelMeta;

type Story = StoryObj<typeof ScalableLabel>;

export const Basic: Story = {
  args: {
    scale: 1.5,
    children: 'Lorem Ipsum',
  },
};

const styles = StyleSheet.create({
  mainContainer: {
    gap: 80,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 1,
    padding: 30,
  },
  buttonsContainer: { width: '100%', flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
  },
});
