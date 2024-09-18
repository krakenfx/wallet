import React from 'react';
import { View } from 'react-native';

import { ReputationTag } from '@/components/Reputation/ReputationTag';

import { REPUTATION } from '@/hooks/useReputation';

import type { Meta, StoryObj } from '@storybook/react';

const ReputationTagMeta: Meta<typeof ReputationTag> = {
  title: 'Reputation/ReputationTag',
  component: ReputationTag,
  args: {
    assetId: 'eip155:8453/erc20:0x1b6a569dd61edce3c383f6d565e2f79ec3a12980',
    reputation: REPUTATION.UNVERIFIED,
    filterOut: { coinDesignation: [], reputation: [] },
  },
  argTypes: {
    reputation: {
      control: {
        type: 'select',
        labels: REPUTATION,
      },
      options: Object.values(REPUTATION),
      mapping: REPUTATION,
      table: {
        type: { summary: 'select' },
        default: { summary: 'HDsegwitBech32' },
      },
    },
  },
};
export default ReputationTagMeta;

export const Unverified: StoryObj<typeof ReputationTag> = {
  args: {
    reputation: REPUTATION.UNVERIFIED,
    filterOut: { coinDesignation: ['network'], reputation: [REPUTATION.WHITELISTED] },
  },
  decorators: [
    Story => {
      return (
        <View
          style={{
            padding: 30,
          }}>
          <Story />
        </View>
      );
    },
  ],
};

export const Whitelisted: StoryObj<typeof ReputationTag> = {
  args: {
    reputation: REPUTATION.WHITELISTED,
    filterOut: { coinDesignation: ['network'], reputation: [] },
  },
  decorators: [
    Story => {
      return (
        <View
          style={{
            padding: 30,
          }}>
          <Story />
        </View>
      );
    },
  ],
};

export const Blacklisted: StoryObj<typeof ReputationTag> = {
  args: {
    reputation: REPUTATION.BLACKLISTED,
    filterOut: { coinDesignation: ['network'], reputation: [REPUTATION.WHITELISTED] },
  },
  decorators: [
    Story => {
      return (
        <View
          style={{
            padding: 30,
          }}>
          <Story />
        </View>
      );
    },
  ],
};

export const FilteredOut: StoryObj<typeof ReputationTag> = {
  args: {
    reputation: REPUTATION.WHITELISTED,
    filterOut: { coinDesignation: ['network'], reputation: [REPUTATION.WHITELISTED] },
  },
  decorators: [
    Story => {
      return (
        <View
          style={{
            padding: 30,
          }}>
          <Story />
        </View>
      );
    },
  ],
};
