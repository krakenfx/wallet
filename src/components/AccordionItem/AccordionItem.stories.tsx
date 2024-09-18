import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { SuperDarkTheme } from '@/theme/themes';

import { Button } from '../Button';

import { AccordionItem } from './AccordionItem';

import type { Meta, StoryObj } from '@storybook/react';

const AccordionItemMeta: Meta<typeof AccordionItem> = {
  title: 'AccordionItem',
  component: AccordionItem,
};

export default AccordionItemMeta;

type Story = StoryObj<typeof AccordionItem>;

const Item = () => {
  const isExpanded = useSharedValue(false);

  const onToggle = () => {
    isExpanded.value = !isExpanded.value;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
      <Button text="Click Me" onPress={onToggle} />
      <AccordionItem isExpanded={isExpanded} style={{ marginTop: 20 }}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime amet magnam deserunt officia odio, quam veritatis natus, cupiditate mollitia aliquam
          pariatur accusantium vitae, harum aut incidunt aperiam officiis fugit nobis?
        </Text>
      </AccordionItem>
    </View>
  );
};

export const Basic: Story = {
  render: Item,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
    position: 'relative',
  },
  text: {
    minHeight: 100,
    minWidth: 250,
    marginTop: 10,
    padding: 20,
    color: SuperDarkTheme.colors.kraken,
    backgroundColor: SuperDarkTheme.colors.purple_40,
  },
});
