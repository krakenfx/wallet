import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

export interface Props {
  text: string | string[];
  boldText?: string;
}
export const SettingsInfoBox = ({ text, boldText }: Props) => {
  return (
    <View style={[styles.infoBase, styles.infoHeader]}>
      <GradientItemBackground />
      <Label type="regularCaption1" color="light75" style={styles.label}>
        {boldText && (
          <Label type="boldCaption1" color="light75">
            {boldText}
          </Label>
        )}
        {text}
      </Label>
    </View>
  );
};
const styles = StyleSheet.create({
  infoBase: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  label: {
    lineHeight: 20,
  },
  infoHeader: {
    marginTop: 16,
    marginBottom: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
