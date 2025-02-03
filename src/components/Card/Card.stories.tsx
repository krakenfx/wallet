import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';

import type { Meta, StoryObj } from '@storybook/react';

const CardMeta: Meta<typeof Card> = {
  title: 'Card',
  component: Card,
  render: function Render(args) {
    return (
      <View style={styles.container}>
        <Card {...args}>
          <View style={styles.cardContent}>
            <Label type="regularTitle1">{'Any type of content allowed here.'}</Label>
            <Label type="regularTitle1" color="light50">
              {'Children components are entirely responsible for aligment and styling.'}
            </Label>
            <Label type="regularTitle1" color="kraken">
              {'Card fits to container dimensions.'}
            </Label>
            <Label type="regularTitle1" color="light75">
              {'Large size prop is the same as basic but with more padding.'}
            </Label>
          </View>
        </Card>
      </View>
    );
  },
};

export default CardMeta;

export const BasicCard: StoryObj<typeof Card> = {
  name: 'Card',
};

export const LargeCard: StoryObj<typeof Card> = {
  name: 'Large Card',
  args: {
    size: 'large',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 300,
    marginHorizontal: 40,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    gap: 10,
  },
});
