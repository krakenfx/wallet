import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { RectangleView } from '@/utils/storybook';

import { SeedDisplay } from './';

import type { Meta, StoryObj } from '@storybook/react';

const SeedDisplayMeta: Meta<typeof SeedDisplay> = {
  title: 'SeedDisplay',
  component: SeedDisplay,
  decorators: [
    Story => (
      <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ isSeedVisible, ...rest }) {
    const [showSeed, setShowSeed] = useState(isSeedVisible);

    const onSeedReveal = async () => setShowSeed(true);

    
    useEffect(() => {
      setShowSeed(isSeedVisible);
    }, [isSeedVisible]);

    return <SeedDisplay {...rest} isSeedVisible={showSeed} onSeedReveal={onSeedReveal} />;
  },
};

export default SeedDisplayMeta;

type Story = StoryObj<typeof SeedDisplay>;

interface StickyFooterProps {
  seedVisible: boolean;
  seed?: string;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ seedVisible }) => (
  <RectangleView description={seedVisible ? `Sticky Footer - seed visible: ${seedVisible.toString()}` : undefined} />
);

export const Basic: Story = {
  args: {
    seed: 'tidy leopard faith sphere soul column commando row scrub warm clerk insert',
    isSeedVisible: true,
    compact: true,
    stickyHeader: <RectangleView description="Sticky Header" />,
    stickyFooter: StickyFooter,
    scrollHeader: <RectangleView description="Scroll Header" style={{ marginTop: 12 }} />,
    scrollFooter: <RectangleView description="Scroll Footer" style={{ marginBottom: 12 }} />,
  },
};
