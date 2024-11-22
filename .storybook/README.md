# Storybook README

## Introduction

Storybook is an open-source tool for developing UI components in isolation for React, Vue, Angular, and more. It allows us to showcase components interactively in an isolated development environment.

This README will guide you through setting up and using Storybook within our project.

## Why Storybook?

- **Isolation**: Develop hard-to-reach states and edge cases.
- **Organization**: Catalogue our UI components and use them like building blocks.
- **Documentation**: Automatically generate a visual documentation of our components.
- **Collaboration**: Easier to share our work with the wider team.

## Setup

Create a .env.storybook file in the root of your repository. This file will contain environment variables specific to Storybook. Add the following line to enable Storybook:
```
STORYBOOK_ENABLED=true
```

## Writing Stories

Stories capture the rendered state of a UI component. They are stored in files ending with `.stories.tsx`. Here's how you can write a story:

```tsx
import { View } from 'react-native';

import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/react';

const ButtonMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    variant: 'primary',
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ButtonMeta;

export const Basic: StoryObj<typeof Button> = {};
```

### Custom argTypes
Every component should be accompanied by a story that exemplifies its essential functionality. When a component supports diverse use cases, consider adding distinct stories to reflect its adaptability. To demonstrate prop variations, leverage `argTypes` within your stories. For intricate or specialized prop interactions, you can define [custom argTypes](https://storybook.js.org/docs/api/doc-blocks/doc-block-argtypes).
```js
const ButtonMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    variant: 'primary',
  },
  argTypes: {
    color: {
      options: ['primary', 'dark', 'light'],
      control: { type: 'select' },
    },
    fontSize: {
      options: ["lg", "md", "sm"],
      mapping: {
        "lg": "text-lg",
        "md": "text-md",
        "sm": "text-sm",
      },
      control: { type: 'select' },
    },
  }
};
```
For more detailed guidance on story composition, consult the [Storybook Stories documentation](https://storybook.js.org/docs/get-started/whats-a-story).

### Custom render function

To implement a custom render function that includes additional logic, such as side effects from useEffect, you can utilize the render function as follows:
```js
const ButtonMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  render: function Render(args) {
    const [count, setCount] = useState(0);

    return (
        <Button {...args} onClick={() => setCount(count + 1)}>
            {count}
        </Button>
    )
  }
};
```

