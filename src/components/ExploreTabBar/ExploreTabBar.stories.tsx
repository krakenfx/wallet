import { useState } from 'react';
import { View } from 'react-native';

import { iconsControl } from '@/utils/storybook';

import { ExploreTabBar } from './ExploreTabBar';

import type { ExploreTabBarProps } from './ExploreTabBar.types';

import type { Meta, StoryObj } from '@storybook/react';

const ExploreTabBarMeta: Meta<typeof ExploreTabBar> = {
  title: 'ExploreTabBar',
  component: ExploreTabBar,
  args: {
    leftIconName: 'wallet',
    centerIconName: 'compass',
    rightIconName: 'scan-walletConnect',
    showTabs: true,
  },
  argTypes: {
    leftIconName: iconsControl,
    centerIconName: iconsControl,
    rightIconName: iconsControl,
  },
  render: function Render(args: ExploreTabBarProps) {
    const [activeTab, setActiveTab] = useState(0);
    const { leftIconName, centerIconName, rightIconName, showTabs = true } = args;
    return (
      <ExploreTabBar
        leftIconName={leftIconName}
        centerIconName={centerIconName}
        rightIconName={rightIconName}
        onTabLeftPress={() => {
          setActiveTab(0);
        }}
        onTabCenterPress={() => {
          setActiveTab(1);
        }}
        onTabRightPress={() => {
          setActiveTab(2);
        }}
        activeTab={activeTab}
        showTabs={showTabs}
      />
    );
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default ExploreTabBarMeta;

export const Basic: StoryObj<typeof ExploreTabBar> = {};
