import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { BottomSheetModal, type BottomSheetModalRef } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';

import { methodOrder } from '../utils';

import { NetworkItem } from './NetworkSelectorItem';

import loc from '/loc';

interface Props {
  methods: KrakenWithdrawMethod[] | undefined;
  asset: KrakenAssetSupported;
  onMethodSelect: (method: KrakenWithdrawMethod) => void;
  onClose: () => void;
}

const END_QUEUE_NUMBER = 100;

const isOldTypeOfNetworkWithdraw = (method: KrakenWithdrawMethod) => {
  return method.network.includes('.e');
};

export const NetworkSelectorSheet = React.forwardRef<BottomSheetModalRef, Props>(({ onClose, onMethodSelect, methods, asset }, ref) => {
  const headerHeight = useHeaderHeight();

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const sortedMethods = useMemo(
    () =>
      methods?.sort((a, b) => {
        let orderA = methodOrder[a.network_id] ?? END_QUEUE_NUMBER;
        let orderB = methodOrder[b.network_id] ?? END_QUEUE_NUMBER;

        if (isOldTypeOfNetworkWithdraw(a)) {
          orderA = orderA + END_QUEUE_NUMBER;
        }

        if (isOldTypeOfNetworkWithdraw(b)) {
          orderB = orderB + END_QUEUE_NUMBER;
        }

        return orderA - orderB;
      }),
    [methods],
  );

  const snapPoints = useCommonSnapPoints('toHeaderTransparent');

  if (!sortedMethods) {
    return null;
  }

  return (
    <BottomSheetModal snapPoints={snapPoints} ref={ref} topInset={headerHeight} onChange={handleSheetChange}>
      <BottomSheetScrollView style={styles.container}>
        <View style={styles.header}>
          <Label type="boldDisplay4" style={styles.headerText}>
            {loc.krakenConnect.selectNetwork.title}
          </Label>
          <Label type="regularBody" color="light75" style={styles.headerText}>
            {loc.formatString(loc.krakenConnect.selectNetwork.description, { assetLabel: asset.metadata.label })}
          </Label>
        </View>
        <View style={styles.networkList}>
          {sortedMethods.map(method => (
            <NetworkItem method={method} key={method.method_id} assetSymbol={asset.symbol} onSelect={onMethodSelect} />
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    textAlign: 'center',
  },
  networkList: {
    gap: 12,
    marginBottom: 32,
  },
});
