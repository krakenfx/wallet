import { useEffect, useMemo, useRef, useState } from 'react';

import { Keyboard, StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';

import { Label } from '@/components/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useKrakenConnectWithdrawMethods } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectWithdrawMethods';
import { useRealmWalletById } from '@/realm/wallets';
import type { NavigationProps } from '@/Routes';
import { NetworkSelectButton } from '@/screens/KrakenConnectSend/components/NetworkSelectButton';
import { NetworkSelectorSheet } from '@/screens/KrakenConnectSend/components/NetworkSelectorSheet';
import { AmountInput, type AmountInputRef } from '@/screens/Send/components/AmountInput';
import { FormProvider } from '@/screens/Send/utils/sendForm';
import { navigationStyle } from '@/utils/navigationStyle';

import { tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { TransactionPathFromKrakenToWallet } from './components/TransactionPathFromKrakenToWallet';
import { TransferFee } from './components/TransferFee';

import loc from '/loc';

export interface KrakenConnectSendScreenNavigationParams {
  krakenAsset: KrakenAssetSupported;
}

const KrakenConnectSend = ({ navigation, route }: NavigationProps<'KrakenConnectSend'>) => {
  const { params } = route;
  const { krakenAsset } = params;
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const snapPoints = useMemo(() => ['100%'], []);
  const { data: methods } = useKrakenConnectWithdrawMethods({ asset: krakenAsset });

  const networkSelectorRef = useRef<BottomSheetModalRef>(null);
  const inputRef = useRef<AmountInputRef>(null);

  const [selectedMethod, setSelectedMethod] = useState<KrakenWithdrawMethod>();
  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false);
  const [inputInFiatCurrency, setInputInFiatCurrency] = useState(false);

  useEffect(() => {
    if (methods?.length === 1) {
      setSelectedMethod(methods[0]);
      inputRef.current?.focus();
    }
    if (methods && methods.length > 1 && !selectedMethod) {
      networkSelectorRef.current?.present();
      Keyboard.dismiss();
    }
  }, [methods, selectedMethod]);

  const currentFeeEstimate = useMemo(() => {
    if (selectedMethod) {
      return selectedMethod.fee.fee;
    }
    return undefined;
  }, [selectedMethod]);
  const feeEstimateInTokensFormat = useMemo(
    () => tokenUnit2SmallestUnit(currentFeeEstimate || 0, krakenAsset.metadata.decimals).toString(10),
    [currentFeeEstimate, krakenAsset.metadata.decimals],
  );

  const wallet = useRealmWalletById(krakenAsset.walletId);

  const { network } = getImplForWallet(wallet);

  const onMethodSelect = (method: KrakenWithdrawMethod) => {
    setSelectedMethod(method);
    networkSelectorRef.current?.close();
    setIsNetworkSelectorOpen(false);
    inputRef.current?.focus();
  };

  const handleNetworkSelectButtonPress = () => {
    Keyboard.dismiss();
    networkSelectorRef.current?.present();
    setIsNetworkSelectorOpen(true);
  };

  const handleNetworkSelectorCLose = () => {
    setIsNetworkSelectorOpen(false);
  };

  const handleToggleCurrency = (value: boolean) => {
    setInputInFiatCurrency(value);
  };
  const showNetworkSelector = methods && methods?.length > 1;

  return (
    <BottomSheet snapPoints={snapPoints} {...bottomSheetProps} style={styles.container}>
      <NetworkSelectorSheet
        ref={networkSelectorRef}
        methods={methods}
        asset={krakenAsset}
        onMethodSelect={onMethodSelect}
        onClose={handleNetworkSelectorCLose}
      />
      <View style={styles.header}>
        <Label type="boldDisplay4" style={styles.listHeader}>
          {loc.formatString(loc.krakenConnect.sendScreen.title, { assetSymbol: krakenAsset.symbol })}
        </Label>
      </View>
      <View style={styles.elements}>
        <TransactionPathFromKrakenToWallet />
        {showNetworkSelector && <NetworkSelectButton selectedMethod={selectedMethod} onPress={handleNetworkSelectButtonPress} isOpen={isNetworkSelectorOpen} />}
        <AmountInput
          ref={inputRef}
          autoFocus={false}
          inputStyle={styles.inputStyle}
          token={krakenAsset}
          network={network}
          currentFeeEstimate={feeEstimateInTokensFormat}
          onToggleCurrency={handleToggleCurrency}
        />
        {selectedMethod && <TransferFee fee={selectedMethod.fee.fee} inputInFiatCurrency={inputInFiatCurrency} asset={krakenAsset} />}
      </View>
    </BottomSheet>
  );
};

export const KrakenConnectSendScreen = (props: NavigationProps<'KrakenConnectSend'>) => {
  return (
    <FormProvider requiredFields={['amount']}>
      <KrakenConnectSend {...props} />
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginHorizontal: 24,
  },
  listHeader: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  elements: {
    gap: 12,
  },
  inputStyle: {
    marginBottom: 0,
  },
});

KrakenConnectSendScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
