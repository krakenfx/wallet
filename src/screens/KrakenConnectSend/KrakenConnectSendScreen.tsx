import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Keyboard, StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useKrakenConnectWithdrawMethods } from '@/reactQuery/hooks/krakenConnect/useKrakenConnectWithdrawMethods';
import { useRealmWalletById } from '@/realm/wallets';
import { type NavigationProps, Routes } from '@/Routes';
import { AmountInput, type AmountInputRef } from '@/screens/Send/components/AmountInput';
import { FormProvider, useFormContext } from '@/screens/Send/utils/sendForm';
import { navigationStyle } from '@/utils/navigationStyle';
import { tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { NetworkSelectButton } from './components/NetworkSelectButton';
import { NetworkSelectorSheet } from './components/NetworkSelectorSheet';
import { TransactionPathFromKrakenToWallet } from './components/TransactionPathFromKrakenToWallet';
import { TransferFee } from './components/TransferFee';
import { useKrakenConnectSendContext } from './KrakenConnectContext';

import loc from '/loc';

export interface KrakenConnectSendScreenNavigationParams {
  krakenAsset: KrakenAssetSupported;
  networkId?: string;
}

const KrakenConnectSend = ({ navigation, route }: NavigationProps<'KrakenConnectSend'>) => {
  const { params } = route;
  const { krakenAsset, networkId: routeNetworkId } = params;
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const snapPoints = useMemo(() => ['100%'], []);
  const { data: methods } = useKrakenConnectWithdrawMethods({ asset: krakenAsset });

  const networkSelectorRef = useRef<BottomSheetModalRef>(null);

  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false);

  const {
    withdrawMethodState: [withdrawMethod, setWithdrawMethod],
    amountState: [_amount, setAmount],
    amountFiatState: [_amountFiat, setAmountFiat],
    isInputInFiatCurrencyState: [isInputInFiatCurrency, setIsInputInFiatCurrency],
  } = useKrakenConnectSendContext();

  const { isFormValid } = useFormContext();

  const amountInputRef = useRef<AmountInputRef>(null);

  useEffect(() => {
    if (methods?.length === 1) {
      setWithdrawMethod(methods[0]);
      amountInputRef.current?.focus();
    }
    if (routeNetworkId && !withdrawMethod) {
      const method = methods?.find(method => method.network_id === routeNetworkId);
      if (method) {
        setWithdrawMethod(method);
      }
    } else if (methods && methods.length > 1 && !withdrawMethod) {
      networkSelectorRef.current?.present();
      Keyboard.dismiss();
    }
  }, [methods, routeNetworkId, setWithdrawMethod, withdrawMethod]);

  const currentFeeEstimate = useMemo(() => {
    if (withdrawMethod) {
      return withdrawMethod.fee.fee;
    }
    return undefined;
  }, [withdrawMethod]);
  const feeEstimateInTokensFormat = useMemo(
    () => tokenUnit2SmallestUnit(currentFeeEstimate || 0, krakenAsset.metadata.decimals).toString(10),
    [currentFeeEstimate, krakenAsset.metadata.decimals],
  );

  const wallet = useRealmWalletById(krakenAsset.walletId);

  const { network: walletNetwork } = getImplForWallet(wallet);

  const onMethodSelect = (method: KrakenWithdrawMethod) => {
    setWithdrawMethod(method);
    networkSelectorRef.current?.close();
    setIsNetworkSelectorOpen(false);
    amountInputRef.current?.focus();
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
    setIsInputInFiatCurrency(value);
  };
  const showNetworkSelector = methods && methods?.length > 1;

  const openConfirmationSheet = async () => {
    const inputAmount = amountInputRef.current?.getAssetAmount();
    const inputAmountFiat = amountInputRef.current?.getFiatAmount();
    if (!inputAmount || !inputAmountFiat) {
      return;
    }
    setAmount(inputAmount.amount);
    setAmountFiat(inputAmountFiat);
    if (withdrawMethod) {
      navigation.navigate(Routes.KrakenConnectSendConfirm, { asset: krakenAsset });
    }
  };

  return (
    <>
      <BottomSheet snapPoints={snapPoints} {...bottomSheetProps} style={styles.container}>
        <BottomSheetScrollView>
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
            {showNetworkSelector && (
              <NetworkSelectButton selectedMethod={withdrawMethod} onPress={handleNetworkSelectButtonPress} isOpen={isNetworkSelectorOpen} />
            )}
            <AmountInput
              ref={amountInputRef}
              autoFocus={false}
              inputStyle={styles.inputStyle}
              token={krakenAsset}
              network={walletNetwork}
              currentFeeEstimate={feeEstimateInTokensFormat}
              onToggleCurrency={handleToggleCurrency}
              minAmount={withdrawMethod?.minimum}
            />
            {withdrawMethod && <TransferFee fee={withdrawMethod.fee.fee} isInputInFiatCurrency={isInputInFiatCurrency} asset={krakenAsset} />}
          </View>
        </BottomSheetScrollView>

        <FloatingBottomButtons
          avoidKeyboard
          primary={{
            disabled: !isFormValid || !withdrawMethod,
            onPress: openConfirmationSheet,
            text: loc.krakenConnect.transfer.title,
          }}
        />
      </BottomSheet>
    </>
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
    flex: 1,
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
