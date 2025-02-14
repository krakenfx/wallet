import type React from 'react';

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SequencedTransition } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { runAfterUISync } from '@/utils/runAfterUISync';

import type { ButtonProps } from '../Button';

import loc from '/loc';

type Props = {
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading: boolean;
  hidden: boolean;
  feeSelector?: React.ReactElement;
  additionalInfo?: React.ReactNode;
  primaryButtonProps?: Partial<ButtonProps>;
  isKrakenConnectTransfer?: boolean;
};

export const TransactionConfirmationFooter: React.FC<Props> = ({
  onCancel,
  onConfirm,
  hidden,
  feeSelector,
  additionalInfo,
  isLoading: propLoading,
  primaryButtonProps,
  isKrakenConnectTransfer,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runAfterUISync(() => {
      setIsLoading(propLoading);
    });
  }, [propLoading]);

  return (
    <View style={[hidden && styles.hidden]}>
      <View style={styles.footer}>
        {!!feeSelector && !isKrakenConnectTransfer && <Label type="boldCaption1">{loc.transactionDetails.confirmation.fee}</Label>}
        {feeSelector}
      </View>
      {additionalInfo}
      <FloatingBottomButtons
        useBottomInset={false}
        noAbsolutePosition
        style={[isLoading && styles.containerLoadingStyle]}
        primary={{
          testID: 'ButtonConfirm',
          text: loc.transactionDetails.confirmation.confirm,
          onPress: onConfirm,
          loading: isLoading,
          style: [isLoading && styles.buttonLoadingStyle],
          layout: SequencedTransition.duration(1000),
          ...(isLoading ? {} : primaryButtonProps),
        }}
        secondary={
          !isLoading
            ? {
                testID: 'ButtonCancel',
                text: loc.transactionDetails.confirmation.cancel,
                onPress: onCancel,
              }
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoadingStyle: {
    justifyContent: 'center',
  },
  buttonLoadingStyle: {
    flex: 0,
    width: 64,
  },
  hidden: {
    opacity: 0,
  },
  footer: {
    marginHorizontal: 24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
