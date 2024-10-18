import React from 'react';

import { Skeleton } from './Skeleton';

import type { Meta, StoryObj } from '@storybook/react';

const SkeletonMeta: Meta<typeof Skeleton> = {
  title: 'Skeleton',
  component: Skeleton,
  args: {},
  decorators: [
    Story => (
      <>
        <Story />
      </>
    ),
  ],
};

export default SkeletonMeta;

export const Basic: StoryObj<typeof Skeleton> = {};

export const SkeletonHero: StoryObj<typeof Skeleton> = {
  decorators: [
    () => (
      <>
        <Skeleton style={{ height: 409, marginVertical: 16 }} />
        <Skeleton style={{ height: 20, width: 132, marginVertical: 4 }} />
        <Skeleton style={{ height: 12, width: 312, marginVertical: 4 }} />
        <Skeleton style={{ height: 12, width: 202, marginVertical: 4 }} />
        <Skeleton style={{ height: 288, marginVertical: 8 }} />
      </>
    ),
  ],
};
