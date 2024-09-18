import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SequencedTransition } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ColorName } from '@/theme/themes';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { useExpandableSheetContext } from '../Sheets/ExpandableSheet/ExpandableSheetContext';

import loc from '/loc';

type Props = {
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading: boolean;
  hidden: boolean;
  feeSelector?: React.ReactElement;
  additionalInfo?: React.ReactNode;
  primaryButtonColor?: ColorName;
};

export const TransactionConfirmationFooter: React.FC<Props> = ({
  onCancel,
  onConfirm,
  hidden,
  feeSelector,
  additionalInfo,
  isLoading: propLoading,
  primaryButtonColor,
}) => {
  const { close } = useExpandableSheetContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    
    runAfterUISync(() => {
      setIsLoading(propLoading);
    });
  }, [propLoading]);

  return (
    <View style={[hidden && styles.hidden]}>
      <View style={styles.footer}>
        <Label type="boldCaption1">{loc.transactionDetails.confirmation.fee}</Label>
        {feeSelector}
      </View>
      {additionalInfo}
      <FloatingBottomButtons
        useBottomInset={false}
        noAbsolutePosition
        style={[isLoading && styles.containerLoadingStyle]}
        primary={{
          testID: 'ButtonConfirm',
          icon: 'face-ID',
          text: loc.transactionDetails.confirmation.confirm,
          onPress: onConfirm,
          loading: isLoading,
          style: [isLoading && styles.buttonLoadingStyle],
          layout: SequencedTransition.duration(1000),
          color: primaryButtonColor,
        }}
        secondary={
          !isLoading
            ? {
                testID: 'ButtonCancel',
                text: loc.transactionDetails.confirmation.cancel,
                onPress: onCancel ?? close,
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
