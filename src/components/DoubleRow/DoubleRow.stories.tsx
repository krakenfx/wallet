import { View } from 'react-native';

import { DoubleRow } from '@/components/DoubleRow';

import type { WalletType } from '@/onChain/wallets/registry';
import { iconsControl } from '@/utils/storybook';

import { TransactionAmount } from '../Transaction';

import type { TokenIconProps } from '../TokenIcon';

import type { Meta, StoryObj } from '@storybook/react';

const transactionAmountProps = {
  label: '',
  assetAmount: '6 ETH',
  assetFiatAmount: '$12,000',
  assetNetwork: 'ethereum' as WalletType,
  assetSymbol: 'ETH',
  tokenIconProps: {
    forceOmitNetworkIcon: false,
    networkName: 'optimism',
    size: 50,
    tokenId: '1',
    tokenSymbol: 'eth',
  } as TokenIconProps,
};

const DoubleRowMeta: Meta<typeof DoubleRow> = {
  title: 'DoubleRow',
  component: DoubleRow,
  args: {
    iconName: 'swap',
    iconSize: 16,
    iconCircleSize: 24,
    iconCircleBorder: 2,
  },
  argTypes: {
    iconName: iconsControl,
  },
  render: args => {
    return (
      <DoubleRow
        {...args}
        renderTop={({ containerStyle }) => <TransactionAmount {...transactionAmountProps} containerStyle={containerStyle} />}
        renderBottom={({ containerStyle }) => <TransactionAmount attached {...transactionAmountProps} containerStyle={containerStyle} />}
      />
    );
  },
  decorators: [
    Story => (
      <View
        style={{
          padding: 30,
        }}>
        <Story />
      </View>
    ),
  ],
};

export default DoubleRowMeta;

export const Basic: StoryObj<typeof DoubleRow> = {
  args: {},
};
