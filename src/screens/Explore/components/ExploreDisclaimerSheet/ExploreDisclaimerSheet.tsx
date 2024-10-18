import BottomSheetRef, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';

import { ExploreDisclaimerSheetProps } from './ExploreDisclaimerSheet.types';

import loc from '/loc';

export const ExploreDisclaimerSheet = forwardRef<BottomSheetRef, ExploreDisclaimerSheetProps>(({ onDismiss, onClose, onContinue, onMount = () => {} }, ref) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <BottomSheet
      snapPoints={['60%']}
      index={1}
      dismissible={false}
      onBackdropPress={onDismiss}
      onDismiss={onDismiss}
      onClose={onClose}
      ref={ref}
      enableDynamicSizing>
      <BottomSheetView>
        <View style={styles.container}>
          <ModalNavigationHeader onClosePress={onDismiss} style={styles.close} />
          <Image source={require('@/assets/images/common/exclamation.png')} />
          <View style={styles.textWrapper}>
            <Label type="boldTitle0" style={styles.centeredText}>
              {loc.explore.disclaimerTitle}
            </Label>
            <Label type="regularBody" color="light75" style={styles.centeredText}>
              {loc.explore.disclaimerBody}
            </Label>
          </View>
          <FloatingBottomButtons noAbsolutePosition primary={{ text: loc._.continue, onPress: onContinue }} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 24,
  },
  textWrapper: {
    paddingHorizontal: 36,
    gap: 8,
    marginBottom: 24,
  },
  centeredText: {
    textAlign: 'center',
  },
});
