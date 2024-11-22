import { StyleSheet, View } from 'react-native';

import type { LabelProps } from '@/components/Label';
import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { Switch } from '@/components/Switch';
import { SettingsIcon } from '@/screens/Settings/components/SettingsIcon';

interface Props {
  icon?: IconName;
  text: string;
  textColor?: LabelProps['color'];
  enabled: boolean;
  onToggle: (newValue: boolean) => void | Promise<void>;
  testID?: string;
}
export const SettingsSwitch = ({ icon, text, textColor, enabled, onToggle, testID }: Props) => {
  return (
    <View style={styles.switchContainer}>
      {!!icon && <SettingsIcon name={icon} />}
      <Label style={styles.label} color={textColor}>
        {text}
      </Label>
      <Switch testID={`SettingsSwitch${testID}-${enabled ? 'On' : 'Off'}`} accessible accessibilityRole="switch" value={enabled} onValueChange={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    flexGrow: 1,
  },
  switchContainer: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
