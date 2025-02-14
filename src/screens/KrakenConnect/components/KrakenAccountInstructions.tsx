import { forwardRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';

import { Button } from '@/components/Button/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { Label } from '@/components/Label';
import { type IconName, SvgIcon } from '@/components/SvgIcon/SvgIcon';
import { type ColorName, useTheme } from '@/theme/themes';

import { URLs } from '/config';
import loc from '/loc';

type StepData = {
  icon: IconName;
  label: string;
  description: string;
  backgroundColor: ColorName;
};

const STEPS: StepData[] = [
  {
    icon: 'kraken',
    label: loc.krakenConnect.stepsToConnect.step1.label,
    description: loc.krakenConnect.stepsToConnect.step1.description,
    backgroundColor: 'kraken',
  },
  {
    icon: 'wallet',
    label: loc.krakenConnect.stepsToConnect.step2.label,
    description: loc.krakenConnect.stepsToConnect.step2.description,
    backgroundColor: 'martinique',
  },
  {
    icon: 'plug-disconnected',
    label: loc.krakenConnect.stepsToConnect.step3.label,
    description: loc.krakenConnect.stepsToConnect.step3.description,
    backgroundColor: 'martinique',
  },
];

type Props = {
  connectToKraken: () => void;
};

const Step = ({ icon, label, description, backgroundColor }: StepData) => {
  const { colors } = useTheme();
  return (
    <View style={styles.step}>
      <View style={[styles.icon, { backgroundColor: colors[backgroundColor] }]}>
        <SvgIcon name={icon} />
      </View>
      <View style={styles.textContainer}>
        <Label type="regularCaption1">{label}</Label>
        <Label type="boldTitle2">{description}</Label>
      </View>
    </View>
  );
};

export const KrakenAccountInstructions = forwardRef<BottomSheetModalRef, Props>(({ connectToKraken }, ref) => {
  const createAccount = () => {
    Linking.openURL(URLs.signUp);
  };
  const { colors } = useTheme();
  return (
    <BottomSheet index={-1} ref={ref} snapPoints={['70%']}>
      <View style={styles.container}>
        <Label type="boldDisplay3">{loc.krakenConnect.stepsToConnect.heading}</Label>
        <View style={styles.stepContainer}>
          <View style={[styles.stepPath, { borderColor: colors.martinique }]} />
          {STEPS.map((s: StepData, index: number) => (
            <Step key={`${s.icon}_${index}`} {...s} />
          ))}
        </View>
      </View>
      <FloatingBottomContainer style={styles.buttons}>
        <Button size="large" color="kraken" text={loc.krakenConnect.unconnected.cta} onPress={createAccount} />
        <Button size="large" text={loc.krakenConnect.stepsToConnect.hasAccount} onPress={connectToKraken} />
      </FloatingBottomContainer>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  buttons: {
    marginHorizontal: 24,
    gap: 12,
  },
  stepContainer: {
    position: 'relative',
    marginVertical: 16,
  },
  stepPath: {
    borderLeftWidth: 4,
    position: 'absolute',
    width: 4,
    top: 25,
    bottom: 25,
    left: 20,
  },
  step: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  icon: {
    borderRadius: 100,
    height: 44,
    width: 44,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
});
