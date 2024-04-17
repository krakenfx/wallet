import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CheckBox } from '@/components/CheckBox';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';

import loc from '/loc';

interface Props {
  onResetApp: () => void;
}

export const DataLossWarning = ({ onResetApp }: Props) => {
  const [dataLoss1Check, setDataLoss1Check] = useState(false);
  const [dataLoss2Check, setDataLoss2Check] = useState(false);
  const [dataLoss3Check, setDataLoss3Check] = useState(false);
  const [dataLoss4Check, setDataLoss4Check] = useState(false);

  const enableResetApp = dataLoss1Check && dataLoss2Check && dataLoss3Check && dataLoss4Check;

  return (
    <>
      <ScrollView style={styles.infoContainer}>
        <Label type="boldDisplay4" style={styles.header}>
          {loc.passwordProtection.dataLossWarning}
        </Label>
        <CheckBox checked={dataLoss1Check} title={loc.passwordProtection.dataLoss1} onPress={() => setDataLoss1Check(prev => !prev)} />
        <CheckBox checked={dataLoss2Check} title={loc.passwordProtection.dataLoss2} onPress={() => setDataLoss2Check(prev => !prev)} />
        <CheckBox checked={dataLoss3Check} title={loc.passwordProtection.dataLoss3} onPress={() => setDataLoss3Check(prev => !prev)} />
        <CheckBox checked={dataLoss4Check} title={loc.passwordProtection.dataLoss4} onPress={() => setDataLoss4Check(prev => !prev)} />
      </ScrollView>
      <FloatingBottomButtons
        primary={{
          disabled: !enableResetApp,
          color: 'light15',
          textColor: 'red400',
          testID: 'ConfirmResetAppButton',
          text: loc.passwordProtection.confirmResetApp,
          onPress: onResetApp,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
  },
});
