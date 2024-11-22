import { ExploreRow } from '../ExploreRow';

import { ExploreText } from './ExploreText';

import type { Meta, StoryObj } from '@storybook/react';

const ExploreTextMeta: Meta<typeof ExploreText> = {
  title: 'Explore/ExploreText',
  component: ExploreText,
  args: {
    title: 'This is the title',
    body: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti nobis nihil nostrum exercitationem quaerat sapiente aliquid eveniet expedita praesentium, laboriosam voluptatibus totam quam labore recusandae maxime quas, voluptate tempora.',
  },
  decorators: [
    Story => (
      <ExploreRow>
        <Story />
      </ExploreRow>
    ),
  ],
};

export default ExploreTextMeta;

export const Basic: StoryObj<typeof ExploreText> = {};
