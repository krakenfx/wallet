import { View } from 'react-native';

import { Label } from '@/components/Label';
import { Currency, getCurrencyInfo } from '@/screens/Settings/currency';

import { BalanceHeader } from './BalanceHeader';

import type { Meta, StoryObj } from '@storybook/react';

const BalanceHeaderMeta: Meta<typeof BalanceHeader> = {
  title: 'BalanceHeader',
  component: BalanceHeader,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default BalanceHeaderMeta;

export const Basic: StoryObj<typeof BalanceHeader> = {
  args: {
    currency: Currency.GBP,
    currencyInfo: getCurrencyInfo(Currency.GBP),
    tokenAmount: '12',
    tokenSymbol: 'BTC',
    tokenId: 'token id',
    fiatValue: 900000,
    header: <Label>{'header'}</Label>,
    footer: <Label>{'footer'}</Label>,
  },
};
