import { HeaderNavigationTitle } from '@/components/HeaderNavigationTitle';

import { Networks } from '@/onChain/wallets/registry';

import type { Meta, StoryObj } from '@storybook/react';

const labels = Object.entries(Networks).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[key] = value.label;
  return acc;
}, {});

const HeaderNavigationTitleMeta: Meta<typeof HeaderNavigationTitle> = {
  title: 'HeaderNavigationTitle',
  component: HeaderNavigationTitle,
  argTypes: {
    coinType: {
      control: {
        type: 'select',
        labels,
      },
      options: Object.values(labels),
      mapping: labels,
      table: {
        type: { summary: 'select' },
        default: { summary: 'HDsegwitBech32' },
      },
    },
    maskedElementUrl: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
  },
};

export default HeaderNavigationTitleMeta;

export const Basic: StoryObj<typeof HeaderNavigationTitle> = {
  args: {
    coinType: 'ethereum',
    maskedElementUrl: 'https://storage.googleapis.com/zapper-fi-assets/apps/compound-v3.png',
    title: 'Compound III',
    subtitle: 'ethereum',
  },
};
