import { noop } from 'lodash';

import { BlockScreenSheet } from './BlockScreenSheet';

import type { Meta, StoryObj } from '@storybook/react';

const BlockScreenSheetMeta: Meta<typeof BlockScreenSheet> = {
  title: 'BlockScreen/BlockScreenSheet',
  component: BlockScreenSheet,
};

export default BlockScreenSheetMeta;

type Story = StoryObj<typeof BlockScreenSheet>;

export const Basic: Story = {
  args: {
    title: 'Transaction Flagged!',
    message: 'This transaction has been flagged by our system.',
    onGoBack: noop,
    onProceed: noop,
  },
};
