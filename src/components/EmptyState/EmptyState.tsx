import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/themes';

import { Button } from '../Button';
import { Label } from '../Label';

import type { EmptyStateProps } from './EmptyState.types';

export const EmptyState: React.FC<EmptyStateProps> = ({ description, ctaLabel, ctaOnPress }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.light15 }]}>
      <Label style={styles.description} type="regularBody" color="light50">
        {description}
      </Label>

      <Button size="small" color="light8" textColor="light100" text={ctaLabel} onPress={ctaOnPress} />
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
