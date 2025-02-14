import { StyleSheet, View } from 'react-native';

import { KrakenIcon } from '../KrakenIcon/KrakenIcon';

import { TokenIconFallback } from '../TokenIcon';

import { ElementWithBadge } from './ElementWithBadge';

import type { ElementWithBadgeProps } from './ElementWithBadge';

import type { Meta, StoryObj } from '@storybook/react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});

type MetaProps = React.FC<ElementWithBadgeProps & { badgePositionTop: number; badgePositionLeft: number }>;

const ElementWithBadgeMeta: Meta<MetaProps> = {
  title: 'ElementWithBadge',
  component: ElementWithBadge,
  args: {
    size: 32,
    badgeSize: 16,
  },
  argTypes: {
    size: { control: { type: 'number' } },
    badgeSize: { control: { type: 'number' } },
    maskShape: {
      control: {
        type: 'select',
      },
      options: ['circle', 'rounded-square'],
      defaultValue: 'circle',
    },
    badgePositionTop: {
      control: 'number',
    },
    badgePositionLeft: {
      control: 'number',
    },
    style: { control: { type: 'object' }, defaultValue: {} },
  },
  render: ({ badgePositionTop, badgePositionLeft, ...props }) => {
    const badgePosition = badgePositionTop !== undefined && badgePositionLeft !== undefined ? { top: badgePositionTop, left: badgePositionLeft } : undefined;
    const maskedElement = <TokenIconFallback size={props.size} tokenSymbol={'ETH'} />;
    const badgeElement = <KrakenIcon size={16} />;
    return <ElementWithBadge badgePosition={badgePosition} maskedElement={maskedElement} badgeElement={badgeElement} {...props} />;
  },
  decorators: [
    Story => {
      return (
        <View style={styles.container}>
          <Story />
        </View>
      );
    },
  ],
};

export default ElementWithBadgeMeta;

export const Basic: StoryObj<typeof ElementWithBadgeMeta> = {
  args: {
    maskShape: 'circle',
  },
};
