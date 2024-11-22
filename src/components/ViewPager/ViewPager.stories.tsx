import { StyleSheet, Text, View } from 'react-native';

import { ViewPager } from './';

import type { Meta, StoryObj } from '@storybook/react';

type ViewPagerPropsAndCustomArgs = React.ComponentProps<typeof ViewPager> & { showSecondaryComponent: boolean };

const ViewPagerMeta: Meta<ViewPagerPropsAndCustomArgs> = {
  title: 'ViewPager',
  component: ViewPager,
  decorators: [
    Story => (
      <View style={{ paddingVertical: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ showSecondaryComponent, secondaryComponent, ...rest }) {
    return <ViewPager {...rest} secondaryComponent={showSecondaryComponent ? secondaryComponent : undefined} />;
  },
};

export default ViewPagerMeta;

type Story = StoryObj<ViewPagerPropsAndCustomArgs>;

const styles = StyleSheet.create({
  childView: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export const Basic: Story = {
  args: {
    left: {
      label: 'Left',
      component: (
        <View style={styles.childView}>
          <Text style={{ color: 'white' }}>Lorem ipsum dolor sit amet</Text>
        </View>
      ),
    },
    right: {
      label: 'Right',
      component: (
        <View style={styles.childView}>
          <Text style={{ color: 'white' }}>Consectetur, adipisicing elit</Text>
        </View>
      ),
    },
    showSecondaryComponent: false,
    secondaryComponent: (
      <View style={{ paddingHorizontal: 30 }}>
        <Text style={{ color: 'white' }}>Secondary component</Text>
      </View>
    ),
  },
};
