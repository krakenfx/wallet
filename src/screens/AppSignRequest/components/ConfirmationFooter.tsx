import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';

import loc from '/loc';

type Props = {
  content: JSX.Element;
  disableConfirmationButton?: boolean;
  onApprove: () => void;
  onReject: () => void;
  isCriticalWarning?: boolean;
};

export const ConfirmationFooter = ({ content, onApprove, onReject, disableConfirmationButton, isCriticalWarning }: Props) => {
  
  const [enableConfirmationButtonAfterTimeout, setEnableConfirmationButtonAfterTimeout] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => setEnableConfirmationButtonAfterTimeout(true), 1000);
      return () => clearTimeout(timeoutId);
    }, []),
  );

  return (
    <View>
      {content}
      <View style={styles.buttonContainer}>
        <FloatingBottomButtons
          useBottomInset={false}
          noAbsolutePosition
          primary={{
            icon: 'face-ID',
            color: isCriticalWarning ? 'red400' : undefined,
            text: loc.appSignRequest.confirm,
            onPress: onApprove,
            disabled: disableConfirmationButton || !enableConfirmationButtonAfterTimeout,
          }}
          secondary={{
            text: loc.appSignRequest.cancel,
            onPress: onReject,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingTop: 16,
  },
});
