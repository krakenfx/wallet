import { StyleSheet } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

export const ArchivedNftsIcon = () => {
  const { colors } = useTheme();

  return <SvgIcon name="wallet" style={[styles.archiveIcon, { backgroundColor: colors.light15 }]} />;
};

const styles = StyleSheet.create({
  archiveIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
