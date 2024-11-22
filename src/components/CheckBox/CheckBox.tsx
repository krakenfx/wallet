import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

type Props = {
  checked: boolean;
  title?: string;
  onPress: () => void;
  testID?: string;
};

export const CheckBox = ({ checked, title, onPress, testID }: Props) => {
  const { colors } = useTheme();

  return (
    <Touchable testID={testID} style={styles.container} onPress={onPress}>
      <View style={[styles.checkbox, { borderColor: colors.light15 }, checked && { backgroundColor: colors.kraken }]}>
        {checked && <SvgIcon name="checkmark" size={20} />}
      </View>
      {title && (
        <Label type="regularCaption1" color="light75" style={styles.label}>
          {title}
        </Label>
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  checkbox: {
    marginTop: 4,
    marginRight: 16,
    borderRadius: 4,
    width: 24,
    height: 24,
    borderWidth: 1,
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    lineHeight: 20,
  },
});
