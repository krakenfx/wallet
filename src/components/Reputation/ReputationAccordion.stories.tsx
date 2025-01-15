import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { ReputationAccordion } from '@/components/Reputation/ReputationAccordion';

import { REPUTATION } from '@/hooks/useReputation';
import { TokenListsRow } from '@/screens/TokenLists/components/TokenListsRow';
import { SuperDarkTheme } from '@/theme/themes';

import { CardWarning } from '../CardWarning';
import { SvgIcon } from '../SvgIcon';

import { WhitelistIcons } from './WhitelistIcons';

import type { Meta, StoryObj } from '@storybook/react';

import loc from '/loc';

const COLOR_OPTIONS = SuperDarkTheme.colors;
const REPUTATION_LISTS = {
  blacklists: [],
  whitelists: ['Token Name Service', '1inch', 'Uniswap Labs Default', 'CoinGecko', 'Zerion', 'Defiprime', 'Kraken'],
};
const WHITELIST_SET = ['Kraken', '1inch', 'CoinGecko', 'Defiprime', 'Token Name Service', 'Uniswap Labs Default', 'Zerion'];
const TOKEN_LIST_COUNT: Record<string, number> = {
  '1inch': 987,
  'Aave Token List': 81,
  Blacklisted: 1003,
  'BlasterDEX Token List - Blast L2': 18,
  'CMC DeFi': 144,
  CoinGecko: 5264,
  Compound: 95,
  Defiprime: 121,
  'Jupiter Solana Token List': 1499,
  Kraken: 193,
  'Popular Tokens': 86,
  'Superchain Token List': 688,
  Synthetix: 16,
  'Token Name Service': 213,
  'Uniswap Labs Default': 696,
  Zerion: 1375,
};

const styles = StyleSheet.create({
  cardWarning: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
  item: {
    paddingHorizontal: 16,
  },
});

const ReputationAccordionMeta: Meta<typeof ReputationAccordion> = {
  title: 'Reputation/ReputationAccordion',
  component: ReputationAccordion,
  args: {
    leftLabelColor: 'light75',
  },
  argTypes: {
    leftLabelColor: {
      control: { type: 'select' },
      options: Object.keys(COLOR_OPTIONS),
    },
  },
};

export default ReputationAccordionMeta;

export const Unverified: StoryObj<typeof ReputationAccordion> = {
  args: {
    leftLabelColor: 'yellow500',
    infoLabel: loc.tokenLists.unverified,
    rightLabelElementOpened: loc.marketData.showLess,
    isWarning: false,
  },
  render: args => (
    <ReputationAccordion
      {...args}
      leftIcon={<SvgIcon name="error" color="yellow500" size={16} />}
      rightLabelElementClosed={
        <Label type="regularBody" color="light75">
          {loc.tokenLists.unverifiedWarning}
        </Label>
      }>
      <CardWarning
        description={loc.tokenLists.unverifiedDescription}
        buttonText={loc.tokenLists.unverifiedButtonLink}
        onPress={() => {
          console.log('Warning Pressed');
        }}
        style={styles.cardWarning}
        type="warning"
        hideLeftIcon
      />
    </ReputationAccordion>
  ),
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

export const LikelySpam: StoryObj<typeof ReputationAccordion> = {
  args: {
    leftLabelColor: 'red400',
    infoLabel: loc.tokenLists.likelySpam,
    rightLabelElementOpened: loc.marketData.showLess,
    isWarning: true,
  },
  render: args => (
    <ReputationAccordion
      {...args}
      leftIcon={<SvgIcon name="warning-filled" color="red400" size={16} />}
      rightLabelElementClosed={
        <Label type="regularBody" color="red400">
          {loc.tokenLists.likelySpamUseCaution}
        </Label>
      }>
      <CardWarning
        description={loc.tokenLists.likelySpamDescription}
        buttonText={loc.tokenLists.likelySpamHelp}
        onPress={() => {
          console.log('Warning Pressed');
        }}
        style={styles.cardWarning}
        type="negative"
        hideLeftIcon
      />
    </ReputationAccordion>
  ),
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

export const TokenList: StoryObj<typeof ReputationAccordion> = {
  args: {
    leftLabelColor: 'light75',
    infoLabel: loc.formatString(loc.reputation.onTokenLists, { count: REPUTATION_LISTS.whitelists.length }),
    rightLabelElementOpened: loc.marketData.showLess,
    isWarning: false,
  },
  render: args => (
    <ReputationAccordion
      {...args}
      leftIcon={<SvgIcon name="verified" color="kraken" size={16} bgColor="light100" />}
      rightLabelElementClosed={<WhitelistIcons whitelists={REPUTATION_LISTS.whitelists} iconSize={23} maxIconCount={5} />}>
      {WHITELIST_SET.map(item => (
        <TokenListsRow
          key={item}
          style={styles.item}
          showOnlyWhiteListed
          tokenListName={item}
          tokenListCount={TOKEN_LIST_COUNT[item] ?? ''}
          reputation={REPUTATION.WHITELISTED}
        />
      ))}
    </ReputationAccordion>
  ),
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
