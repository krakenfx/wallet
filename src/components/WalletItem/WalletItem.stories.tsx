import React from 'react';
import { View } from 'react-native';

import { MenuProvider } from '@/components/Menu';
import { RealmAccount } from '@/realm/accounts';
import { SecuredRealmProvider } from '@/realm/SecuredRealmProvider';

import { WalletItem } from './WalletItem';

import type { Meta, StoryObj } from '@storybook/react';

const WalletItemMeta: Meta<typeof WalletItem> = {
  title: 'WalletItem',
  component: WalletItem,
  args: {
    account: {
      accountNumber: 0,
      accountCustomName: 'Storybook Account',
      balance: 1234.56,
      didLoadOnce: false,
    } as RealmAccount,
    onPress: (accountNumber: number) => console.debug(`Account Number ${accountNumber} clicked`),
  },
};

export default WalletItemMeta;

export const Basic: StoryObj<typeof WalletItem> = {
  args: {
    isFirst: true,
    isLast: true,
    isCurrentAccount: false,
  },
  decorators: [
    Story => (
      <SecuredRealmProvider>
        <MenuProvider>
          <View
            style={{
              padding: 30,
            }}>
            <Story />
          </View>
        </MenuProvider>
      </SecuredRealmProvider>
    ),
  ],
};

export const List: StoryObj<typeof WalletItem> = {
  args: {
    isCurrentAccount: true,
  },
  decorators: [
    (_, { args: { isCurrentAccount, ...rest } }) => (
      <SecuredRealmProvider>
        <MenuProvider>
          <View
            style={{
              padding: 30,
            }}>
            <WalletItem {...rest} isFirst={true} />
            <WalletItem {...rest} isCurrentAccount={isCurrentAccount} />
            <WalletItem {...rest} />
            <WalletItem {...rest} isLast={true} />
          </View>
        </MenuProvider>
      </SecuredRealmProvider>
    ),
  ],
};
