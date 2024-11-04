import { noop } from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { typographyControl } from '@/utils/storybook';

import { Label } from '../Label';

import { Menu, MenuProvider } from './';

import type { Meta, StoryObj } from '@storybook/react';

const MenuMeta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
  decorators: [
    Story => (
      <MenuProvider>
        <View style={{ padding: 24, justifyContent: 'center', flex: 1 }}>
          <Story />
        </View>
      </MenuProvider>
    ),
  ],
};

export default MenuMeta;

export const ContextMenu: StoryObj<typeof Menu> = {
  args: {
    type: 'context',
    menuYOffset: 10,
    menuWidth: 250,
    disabled: false,
    items: [
      {
        title: 'Edit',
        icon: 'pencil',
        onPress: noop,
      },
      {
        title: 'Connected Apps',
        icon: 'apps',
        onPress: noop,
      },
      {
        title: 'Advanced Info',
        icon: 'tool',
        onPress: noop,
      },
      {
        title: 'Delete',
        tintColor: 'red400',
        icon: 'trash',
        onPress: noop,
      },
    ],
  },
  render: function Render(args) {
    const MenuComponent = (
      <Menu {...args}>
        <Label>Show menu</Label>
      </Menu>
    );

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
      </View>
    );
  },
};

export const DropdownMenu: StoryObj<typeof Menu> = {
  args: {
    type: 'dropdown',
    title: 'Lorem Ipsum',
    onSelect: noop,
    selectedId: 1,
    labelLeftType: 'boldBody',
    options: [
      {
        id: 1,
        labelLeft: 'Edit',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
      },
      {
        id: 2,
        labelLeft: 'Connected Apps',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
      },
      {
        id: 3,
        labelLeft: 'Advanced Info',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
      },
      {
        id: 4,
        labelLeft: 'Delete',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
      },
    ],
  },
  argTypes: {
    labelLeftType: typographyControl,
  },
  render: function Render(props) {
    const MenuComponent = (
      <Menu {...props}>
        <Label>Show menu</Label>
      </Menu>
    );
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
      </View>
    );
  },
};

export const TooltipMenu: StoryObj<typeof Menu> = {
  args: {
    type: 'tooltip',
    tooltip: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime amet magnam deserunt officia odio',
  },
  render: function Render(props) {
    const MenuComponent = (
      <Menu menuYOffset={12} {...props}>
        <Label>Show tooltip</Label>
      </Menu>
    );
    return (
      <View style={styles.flex}>
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
        <View style={styles.flex} />
        <View style={styles.row}>
          {MenuComponent}
          {MenuComponent}
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
