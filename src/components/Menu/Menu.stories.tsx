import { noop } from 'lodash';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { IconButton } from '../IconButton';

import { DropdownMenuProps } from './DropdownMenu';

import { Menu, MenuProvider } from './';

import type { Meta, StoryObj } from '@storybook/react';

const MenuMeta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
  decorators: [
    Story => (
      <MenuProvider>
        <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
          <Story />
        </View>
      </MenuProvider>
    ),
  ],
};

export default MenuMeta;

type Story = StoryObj<typeof Menu>;

export const ContextMenu: Story = {
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
    return (
      <Menu {...args}>
        <IconButton name="more" onPress={noop} />
      </Menu>
    );
  },
};

interface DropdownMenuStoryProps extends DropdownMenuProps<number> {
  showIcons: boolean;
}

export const DropdownMenu: StoryObj<DropdownMenuStoryProps> = {
  args: {
    title: 'Lorem Ipsum',
    onSelect: noop,
    selectedId: 1,
    labelLeftType: 'boldBody', 
    disabled: false,
    showIcons: false,
    options: [
      {
        id: 1,
        labelLeft: 'Edit',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
        icon: 'pencil',
      },
      {
        id: 2,
        labelLeft: 'Connected Apps',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
        icon: 'apps',
      },
      {
        id: 3,
        labelLeft: 'Advanced Info',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
        icon: 'tool',
      },
      {
        id: 4,
        labelLeft: 'Delete',
        labelBottomLeft: '',
        labelRight: '',
        labelBottomRight: '',
        icon: 'trash',
      },
    ],
  } as DropdownMenuStoryProps,
  render: function Render({ showIcons, options, ...rest }: PropsWithChildren<DropdownMenuStoryProps>) {
    const optionsWithIcons = showIcons ? options : options.map(option => ({ ...option, icon: undefined }));
    return (
      <Menu type="dropdown" {...rest} options={optionsWithIcons}>
        <IconButton name="more" onPress={noop} />
      </Menu>
    );
  },
};
