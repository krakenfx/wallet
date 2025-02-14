import { StyleSheet } from 'react-native';

import { Label } from '@/components/Label';

const styles = StyleSheet.create({
  header: {
    textTransform: 'uppercase',
  },
});

export const DefiDetailsHeaderFooter = (
  <Label type="boldCaption2" color="light50" style={styles.header}>
    {'TODO'}
  </Label>
);
