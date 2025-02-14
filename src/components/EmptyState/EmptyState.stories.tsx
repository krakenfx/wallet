import { noop } from 'lodash';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from './EmptyState';

import type { EmptyStateProps } from './EmptyState.types';

import type { Meta, StoryObj } from '@storybook/react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
});

type MetaProps = React.FC<EmptyStateProps>;

const EmptyStateMeta: Meta<MetaProps> = {
  title: 'EmptyState',
  component: EmptyState,
  decorators: [
    Story => {
      return (
        <View style={styles.container}>
          <Story />
        </View>
      );
    },
  ],
};

export default EmptyStateMeta;

export const Basic: StoryObj<typeof EmptyStateMeta> = {
  args: {
    description: 'No positions yet. Participate in DeFi to earn yield on your assets.',
    ctaLabel: 'Start earning',
    ctaOnPress: noop,
  },
};
