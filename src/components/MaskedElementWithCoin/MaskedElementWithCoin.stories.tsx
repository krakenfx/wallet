import { StyleSheet, View } from 'react-native';

import type { MaskedElementWithCoinProps } from '@/components/MaskedElementWithCoin';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';

import { Networks } from '@/onChain/wallets/registry';

import { TokenIconFallback } from '../TokenIcon';

import type { Meta, StoryObj } from '@storybook/react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});

const networkLabels = Object.entries(Networks).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[key] = value.label;
  return acc;
}, {});

type MetaProps = React.FC<MaskedElementWithCoinProps & { coinPositionTop: number; coinPositionLeft: number }>;

const MaskedElementWithCoinMeta: Meta<MetaProps> = {
  title: 'MaskedElementWithCoin',
  component: MaskedElementWithCoin,
  args: {
    size: 32,
    coinSize: 16,
  },
  argTypes: {
    coinType: {
      control: {
        type: 'select',
        labels: networkLabels,
      },
      options: Object.values(networkLabels),
      mapping: networkLabels,
      table: {
        type: { summary: 'select' },
        default: { summary: 'HDsegwitBech32' },
      },
    },
    size: { control: { type: 'number' } },
    coinSize: { control: { type: 'number' } },
    coinBorderSize: { control: { type: 'number' } },
    maskShape: {
      control: {
        type: 'select',
      },
      options: ['circle', 'rounded-square'],
      defaultValue: 'circle',
    },
    coinPositionTop: {
      control: 'number',
    },
    coinPositionLeft: {
      control: 'number',
    },
    style: { control: { type: 'object' }, defaultValue: {} },
  },
  render: ({ coinPositionTop, coinPositionLeft, ...props }) => {
    const coinPosition = coinPositionTop !== undefined && coinPositionLeft !== undefined ? { top: coinPositionTop, left: coinPositionLeft } : undefined;
    const maskedElement = <TokenIconFallback size={props.size} tokenSymbol={'ETH'} />;
    return <MaskedElementWithCoin coinPosition={coinPosition} maskedElement={maskedElement} {...props} />;
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

export default MaskedElementWithCoinMeta;

export const Basic: StoryObj<typeof MaskedElementWithCoinMeta> = {
  args: {
    coinType: 'ethereum',
    maskShape: 'circle',
  },
};
