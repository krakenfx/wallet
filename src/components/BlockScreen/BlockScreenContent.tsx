import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import { SvgIcon } from '../SvgIcon';

import loc from '/loc';

export type BlockScreenProps = {
  onGoBack: () => void;
  onProceed: () => void;
  title: string;
  message: string;
};

export const BlockScreenContent: React.FC<BlockScreenProps> = React.memo(({ onGoBack, onProceed, title, message }) => {
  return (
    <>
      <View style={styles.containerTop}>
        <SvgIcon name="warning-filled" size={64} color="red400" style={styles.icon} />
        <Label type="boldDisplay4" color="red400" style={styles.title}>
          {title}
        </Label>
        <Label type="mediumBody" color="red400" style={styles.body}>
          {message}
        </Label>
        <Button
          text={loc.onChainSecurity.ignoreWarningAndProceed}
          textType="regularCaption1"
          onPress={onProceed}
          textColor="red400"
          color="red400_15"
          style={styles.ctaSmall}
        />
      </View>
      <View style={styles.containerBottom}>
        <Button
          icon="chevron-left"
          text={loc.onChainSecurity.returnToSafety}
          onPress={onGoBack}
          color="light100"
          iconColor="dark100"
          textColor="dark100"
          textType="boldBody"
          size="large"
        />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  containerTop: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 24,
  },
  containerBottom: {
    paddingBottom: 70,
    paddingHorizontal: 24,
  },
  icon: {
    marginTop: 88,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  body: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  ctaSmall: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
