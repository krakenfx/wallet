import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

import { Label } from '../Label';

import type { EmptyStateProps } from './EmptyState.types';

export const EmptyState: React.FC<EmptyStateProps> = ({ description }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.light15 }]}>
      <Label style={styles.description} type="regularBody" color="light50">
        {description}
      </Label>
      {}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderWidth: 1.5,
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  description: {
    textAlign: 'center',
  },
});
