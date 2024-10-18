import React from 'react';
import { View } from 'react-native';

import { MenuProvider } from '@/components/Menu';
import { RealmAccount } from '@/realm/accounts';
import { SecuredRealmProvider } from '@/realm/SecuredRealmProvider';

import { WalletItem } from './WalletItem';

import type { Meta, StoryObj } from '@storybook/react';

const realmAccount = {
  accountNumber: 0,
  accountCustomName: 'Storybook Account',
  balance: 1234.56,
  didLoadOnce: false,
} as RealmAccount;

const WalletItemMeta: Meta<typeof WalletItem> = {
  title: 'WalletItem',
  component: WalletItem,
  args: {
    account: realmAccount,
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
            <WalletItem {...rest} account={{ ...realmAccount, accountNumber: 1 }} isCurrentAccount={isCurrentAccount} />
            <WalletItem {...rest} account={{ ...realmAccount, accountNumber: 2 }} />
            <WalletItem {...rest} account={{ ...realmAccount, accountNumber: 3 }} isLast={true} />
          </View>
        </MenuProvider>
      </SecuredRealmProvider>
    ),
  ],
};
