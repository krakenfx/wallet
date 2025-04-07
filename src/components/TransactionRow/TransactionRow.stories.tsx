import { View } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';

import { TransactionRow } from './TransactionRow';

import type { Meta, StoryObj } from '@storybook/react';

const TransactionRowMeta: Meta<typeof TransactionRow> = {
  title: 'TransactionRow',
  component: TransactionRow,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default TransactionRowMeta;

export const Basic: StoryObj<typeof TransactionRow> = {
  args: {
    amounts: (
      <>
        <Label color="light75">{'amounts'}</Label>
        <Label color="light50">{'amounts'}</Label>
      </>
    ),
    icon: <TokenIcon forceOmitNetworkIcon />,
    subtitle: <Label>{'subtitle'}</Label>,
    title: <Label>{'title'}</Label>,
  },
};
