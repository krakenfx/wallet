import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { BottomSheetModal, type BottomSheetModalRef } from '@/components/BottomSheet';
import { CardWarning } from '@/components/CardWarning';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { KeyboardAvoider } from '@/components/Keyboard';
import { Label } from '@/components/Label';

import { DEFAULT_SLIPPAGE, SLIPPAGE_HIGH, SLIPPAGE_LOW, SLIPPAGE_UNSUPPORTED } from '../../SwapScreen.constants';

import { SlippageSettings } from '../SlippageSettings';

import loc from '/loc';

type Props = {
  onSave: (newSlippage: number) => void;
  currentSlippage: number;
};

export type SlippageConfigSheetMethods = {
  open: () => void;
  close: () => void;
};

export const SlippageConfigSheet = React.forwardRef<SlippageConfigSheetMethods, Props>(({ onSave, currentSlippage }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);

  const [fixedSlippageAmount, setFixedSlippageAmount] = useState<string>(DEFAULT_SLIPPAGE.toString());

  const handleFixedSlippageChange = (value: string | number) => {
    setFixedSlippageAmount(value.toString());
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setFixedSlippageAmount(currentSlippage.toString());
        bottomSheetModalRef.current?.present();
      },
      close: () => bottomSheetModalRef.current?.close(),
    }),
    [currentSlippage],
  );

  const { isValid, warning } = useMemo(() => {
    const maybeNumber = Number(fixedSlippageAmount);

    if (isNaN(maybeNumber) || maybeNumber <= 0) {
      return {
        isValid: false,
      };
    }
    switch (true) {
      case maybeNumber > SLIPPAGE_UNSUPPORTED: {
        return {
          isValid: false,
          warning: loc.formatString(loc.swap.slippageSettings.warningUnsupported, { amount: SLIPPAGE_UNSUPPORTED }).toString(),
        };
      }
      case maybeNumber > SLIPPAGE_HIGH: {
        return {
          isValid: true,
          warning: loc.formatString(loc.swap.slippageSettings.warningHigh, { amount: SLIPPAGE_HIGH }).toString(),
        };
      }
      case maybeNumber < SLIPPAGE_LOW: {
        return {
          isValid: true,
          warning: loc.formatString(loc.swap.slippageSettings.warningSmall, { amount: SLIPPAGE_LOW }).toString(),
        };
      }
      default: {
        return {
          isValid: true,
        };
      }
    }
  }, [fixedSlippageAmount]);

  const handleSave = () => {
    if (!isValid) {
      return;
    }
    Keyboard.dismiss();
    onSave(Number(Number(fixedSlippageAmount).toFixed(2)));
  };

  return (
    <BottomSheetModal stackBehavior="push" ref={bottomSheetModalRef} enableDynamicSizing onBackdropPress={Keyboard.dismiss}>
      <BottomSheetScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <KeyboardAvoider style={styles.flex}>
          <View style={styles.container}>
            <View style={styles.sheetTitle}>
              <Label type="boldDisplay5">{loc.swap.slippageSettings.title}</Label>
              <Label type="regularBody" color="light75">
                {loc.swap.slippageSettings.desc}
              </Label>
            </View>
            <View style={styles.content}>
              <GradientItemBackground backgroundType="modal" key={warning} />
              <View>
                <SlippageSettings value={fixedSlippageAmount} onChange={handleFixedSlippageChange} />
              </View>
              {!!warning && (
                <CardWarning iconSize={16} description={warning} type={warning === 'unsupported' ? 'negative' : 'warning'} style={styles.slippageWarning} />
              )}
              <Label type="regularCaption1" color="light75">
                {loc.swap.slippageSettings.footer}
              </Label>
            </View>
          </View>
          <FloatingBottomButtons
            noAbsolutePosition
            primary={{
              text: loc.swap.slippageSettings.save,
              disabled: !isValid,
              onPress: handleSave,
            }}
            style={styles.buttons}
          />
        </KeyboardAvoider>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheetTitle: {
    padding: 12,
    gap: 8,
  },
  container: {
    paddingHorizontal: 12,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 1,
  },
  fixedOption: {
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  slippageWarning: {
    marginBottom: 16,
    marginTop: 6,
  },
  toggle: {
    height: 32,
  },
  buttons: {
    marginTop: 24,
  },
});
