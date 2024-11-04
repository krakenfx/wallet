import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

type Props = {
  topOffset?: number;
};

export const DividerOverlay: React.FC<Props> = ({ topOffset = -14 }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="none">
      <SvgIcon
        color="light75"
        name="double-chevron-down"
        style={[
          styles.icon,
          {
            backgroundColor: colors.swapIconBg,
            borderColor: colors.swapIconBorder,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    zIndex: 2,
  },
  icon: {
    borderWidth: 2,
    borderRadius: 20,
  },
});
