import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { CurvedTransition, FadeIn, FadeOut } from 'react-native-reanimated';

import { CardWarning } from '@/components/CardWarning';
import { Label } from '@/components/Label';

import type { AddressAnalysis } from '../hooks/useAddressAnalysis';

import loc from '/loc';

type Props = {
  addressAnalysis: AddressAnalysis;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
};

const Warning: React.FC<NonNullable<NonNullable<AddressAnalysis['result']>['warning']>> = ({ severity, message }) => {
  if (severity === 'INFO') {
    return <CardWarning type="info" description={message} iconSize={18} style={styles.alertBox} />;
  }
  return (
    <CardWarning
      title={severity === 'CRITICAL' ? loc.send.warning.titleCritical : loc.send.warning.title}
      description={message}
      type={severity === 'CRITICAL' ? 'negative' : 'warning'}
    />
  );
};

export const AddressAnalysisInfo: React.FC<Props> = ({ addressAnalysis: { result }, animated = true, style }) => {
  if (!result) {
    return null;
  }
  const { prevSendCount, warning } = result;

  const showFirstTimeSendingWarning = prevSendCount === 0 && (!warning || warning.severity === 'INFO');

  return (
    <Animated.View
      entering={animated ? FadeIn : undefined}
      exiting={animated ? FadeOut : undefined}
      style={[styles.container, style]}
      layout={CurvedTransition}>
      {prevSendCount > 0 && (
        <Label type="regularCaption1" color="light50" style={styles.alertBox}>
          {loc.formatString(loc.send.warning.nthTimeSending, { count: prevSendCount })}
        </Label>
      )}
      {showFirstTimeSendingWarning && <Warning severity="INFO" message={loc.send.warning.firstTimeSending} />}
      {!!warning && <Warning {...warning} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  alertBox: {
    marginBottom: 16,
    alignSelf: 'center',
  },
});
