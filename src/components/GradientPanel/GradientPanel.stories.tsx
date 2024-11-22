import { StyleSheet, Text, View } from 'react-native';

import { TokenIcon } from '../TokenIcon';

import { GradientPanel, GradientPanelFooter, GradientPanelHeader } from './GradientPanel';

import type { Meta, StoryObj } from '@storybook/react';

const GradientPanelMeta: Meta<typeof GradientPanel> = {
  title: 'GradientPanel',
  component: GradientPanel,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default GradientPanelMeta;

export const Basic: StoryObj<typeof GradientPanel> = {
  render: function Render() {
    return (
      <View>
        <GradientPanelHeader>
          <View style={styles.panelHeader}>
            <Text style={styles.text}>This is the Panel Header</Text>
          </View>
        </GradientPanelHeader>
        <GradientPanel>
          <View style={styles.panel}>
            <TokenIcon networkName="ethereum" forceOmitNetworkIcon />
            <Text style={styles.text}>This is the Panel Body</Text>
          </View>
        </GradientPanel>
        <GradientPanelFooter>
          <View style={styles.panel}>
            <Text style={styles.text}>This is the Panel Footer</Text>
          </View>
        </GradientPanelFooter>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 12,
    paddingTop: 12,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: 'white',
  },
});
