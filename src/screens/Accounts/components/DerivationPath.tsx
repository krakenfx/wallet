import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { showToast } from '@/components/Toast';

import loc from '/loc';

export const DerivationPath = ({ derivationPath }: { derivationPath: string }) => {
  const [copied, setCopied] = useState(false);
  const onPress = useCallback(() => {
    Clipboard.setString(String(derivationPath));
    showToast({ type: 'success', text: loc.advancedAccountInfo.pathCopied });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  }, [derivationPath]);

  return (
    <>
      <View style={styles.panelContent}>
        <Label type="regularCaption1" color="light75">
          {loc.advancedAccountInfo.derivationPath}
        </Label>
        <Label type="boldBody">{derivationPath}</Label>
      </View>
      <Button
        textType="boldCaption1"
        color={copied ? 'green500' : 'light15'}
        icon={copied ? 'checkmark' : 'copy'}
        iconColor="light100"
        iconSize={16}
        textColor="light100"
        size="medium"
        onPress={onPress}
        text={copied ? loc._.copied : loc._.copy}
        style={styles.button}
      />
    </>
  );
};

const styles = StyleSheet.create({
  panelContent: {
    gap: 4,
  },

  button: {
    height: 36,
    minWidth: 105,
    paddingHorizontal: 16,
  },
});
