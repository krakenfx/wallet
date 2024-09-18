import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

type Props = {
  style?: StyleProp<ViewStyle>;
  size?: number;
  completed?: boolean;
};

export const BackupCompletionBadge: React.FC<Props> = ({ size = 24, completed, style }) => {
  const { colors } = useTheme();

  if (completed) {
    return <SvgIcon size={size} name="check-circle-filled" color="green500" style={style} />;
  }

  return (
    <View
      style={[
        styles.completionEmpty,
        {
          backgroundColor: colors.dark15,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: colors.light15,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  completionState: {
    marginRight: 8,
  },
  completionEmpty: {
    borderWidth: 1,
  },
});
