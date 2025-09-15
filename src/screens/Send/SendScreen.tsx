import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NameResolver from '@/api/NameResolver';
import type { AnalyseAddressResult, FeeOption } from '@/api/types';
import { BlockScreenModal } from '@/components/BlockScreen';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { CoinHeader } from '@/components/CoinHeader';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { GradientScreenView } from '@/components/Gradients';
import { KeyboardAvoider } from '@/components/Keyboard';
import { NftBlock } from '@/components/NftBlock';
import { showToast } from '@/components/Toast';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { PrepareError } from '@/onChain/wallets/bitcoin';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useCurrentAccountNumber } from '@/realm/accounts';
import { useNftById } from '@/realm/nfts';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useResolvedAssetBalance, useTokenById } from '@/realm/tokens';
import { useRealmWalletById } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { NftCollectionDetails } from '@/screens/Nfts/components/NftCollectionDetails';
import type { AmountInputRef } from '@/screens/Send/components/AmountInput';
import { AmountInput } from '@/screens/Send/components/AmountInput';
import { FeeAmountWarning } from '@/screens/Send/components/FeeAmountWarning';
import type { AssetBalanceId } from '@/types';
import { unitConverter } from '@/utils/unitConverter';

import { AddressSelector } from './components/AddressSelector';
import { FeeSelector } from './components/FeeSelector';
import { useAddressAnalysis } from './hooks/useAddressAnalysis';
import { useFeeEstimates } from './hooks/useFeeEstimates';
import { useRefreshingFeeOptions } from './hooks/useRefreshingFeeOptions';
import { useTransactionMethods } from './hooks/useTransactionMethods';

import { decodeQrCodeAddress } from './utils/decodeQrCodeAddress';
import { getDefaultFeeOption } from './utils/getDefaultFeeOption';
import { FormProvider, useFormContext } from './utils/sendForm';
import { isValidAddress } from './utils/validateAddress';

import type { SendNavigationProps } from './SendRouter';
import type { TransactionParams } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type SendRouteParams = ({ assetBalanceId: AssetBalanceId } | { nftAssetId: string }) & {
  addressValue?: string;
  address?: string;
  qrCode?: string;
  addressAnalysisCache?: AnalyseAddressResult[];
  fromUniversalSend?: boolean;
};

const Send = ({ navigation, route: { params } }: SendNavigationProps<'Send'>) => {
  const addressValue = params.addressValue || params.address || '';
  const address = params.address || '';
  const qrCode = params.qrCode;
  const fromUniversalSend = params.fromUniversalSend;

  const currentAccount = useCurrentAccountNumber();
  const { isFormValid } = useFormContext();
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);
  const [inputInFiatCurrency, setInputInFiatCurrency] = useState(false);

  const [__, _, tokenId] = useResolvedAssetBalance('assetBalanceId' in params ? params.assetBalanceId : undefined);
  const token = useTokenById(tokenId);

  const nft = useNftById('nftAssetId' in params ? params.nftAssetId : undefined);

  const blockScreenRef = useRef<BottomSheetModalRef>(null);

  const data = useMemo(() => {
    if (nft) {
      return {
        walletId: nft.walletId,
        nft,
      };
    }
    return {
      walletId: token!.walletId,
      token: token!,
    };
  }, [nft, token]);

  const wallet = useRealmWalletById(data.walletId);

  const { network } = getImplForWallet(wallet);

  const addressAnalysis = useAddressAnalysis(network, address, params.addressAnalysisCache);

  const feePrice = useTokenPrice({ assetId: network.nativeTokenCaipId }) ?? 0;

  const amountInputRef = useRef<AmountInputRef>(null);
  const { amount, isMax: useMaxAmount } = amountInputRef.current?.getAssetAmount() ?? {};

  const transactionParams: TransactionParams | undefined = useMemo(() => {
    if (!isValidAddress(network, address)) {
      return;
    }
    if (data.nft) {
      return {
        type: 'nft',
        nft: data.nft,
        address,
      };
    }
    if (!token || !amount || !Number(amount)) {
      return;
    }
    return {
      amount,
      token,
      address,
      useMaxAmount,
      type: token?.assetId === network.nativeTokenCaipId ? 'coin' : 'token',
    };
  }, [address, amount, data.nft, network, token, useMaxAmount]);

  const transactionMethods = useTransactionMethods(wallet, transactionParams);

  const defaultFeeOption = getDefaultFeeOption(wallet);

  const { selectedFee, setSelectedFee, fees } = useRefreshingFeeOptions(wallet, false, defaultFeeOption);

  const simulateTransaction = useCallback(
    async (feeToSimulate: FeeOption) => {
      if (!transactionMethods?.prepare || !transactionMethods.create || !isFormValid || !feeToSimulate) {
        return;
      }
      try {
        return await transactionMethods.prepare(await transactionMethods.create(), feeToSimulate);
      } catch (e) {
        if (e instanceof PrepareError && e.reason === 'exceedingBalance') {
          amountInputRef.current?.showFeeError();
        } else {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      }
    },
    [isFormValid, transactionMethods],
  );

  const { feeEstimates, isLoading: isFeeLoading } = useFeeEstimates(wallet, fees, isFormValid, simulateTransaction, selectedFee, !!data.nft);

  const currentFeeEstimate = useMemo(() => feeEstimates && selectedFee && feeEstimates[selectedFee].amount, [feeEstimates, selectedFee]);

  const { navigate, setParams } = navigation;

  const headerTitleComponent = useCallback(
    () =>
      data.nft ? (
        <NftCollectionDetails size={32} nft={data.nft} label={loc.send.title_nft} />
      ) : (
        <CoinHeader wallet={wallet} token={token} text={loc.send.title} />
      ),
    [data.nft, token, wallet],
  );

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ headerTitle: headerTitleComponent });
  }, [headerTitleComponent, navigation]);

  const onChangeAddress = useCallback(
    (value: string) => {
      setParams({ addressValue: value, address: value, qrCode: '' });
    },
    [setParams],
  );

  const onValidName = useCallback(
    (name: string, resolvedAddress: string) => {
      setParams({ addressValue: name, address: resolvedAddress, qrCode: '' });
    },
    [setParams],
  );

  const getSenderLabel = useCallback(async (): Promise<string> => {
    const nameResolver = new NameResolver(network);
    const senderAddress = await network.deriveAddress(wallet);
    if (!nameResolver.isNetworkSupported()) {
      return senderAddress;
    }
    try {
      return (await nameResolver.resolveAddress(senderAddress)) || senderAddress;
    } catch {
      return senderAddress;
    }
  }, [network, wallet]);

  const handleToggleCurrency = (value: boolean) => {
    setInputInFiatCurrency(value);
  };

  const getWalletStorage = useGetWalletStorage();

  const create = useCallback(async () => {
    setIsSimulationLoading(true);
    try {
      if (!data.walletId) {
        throw Error('Internal error: missing wallet ID');
      }

      if (!transactionParams || !transactionMethods) {
        throw Error('Internal error: missing transaction data');
      }
      const fee = fees.find(o => o.kind === selectedFee);
      if (!fee) {
        throw Error('Internal error: missing fee');
      }

      await getWalletStorage(wallet, true);

      const senderLabel = await getSenderLabel();
      const recipientLabel = addressValue !== address ? addressValue : transactionParams.address;
      const latestSimulatedTx = await transactionMethods.prepare(await transactionMethods.create(), fee);
      navigate(Routes.SendConfirm, {
        transactionParams,
        simulatedTx: latestSimulatedTx,
        senderLabel,
        recipientLabel,
        selectedFee: fee,
        walletId: data.walletId,
        inputInFiat: inputInFiatCurrency,
        addressAnalysis,
        fromUniversalSend,
      });
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.errors.genericTryAgainLater });
    } finally {
      setIsSimulationLoading(false);
    }
  }, [
    data.walletId,
    transactionParams,
    transactionMethods,
    fees,
    getWalletStorage,
    wallet,
    getSenderLabel,
    addressValue,
    address,
    navigate,
    inputInFiatCurrency,
    addressAnalysis,
    fromUniversalSend,
    selectedFee,
  ]);

  const onContinue = useCallback(() => {
    if (addressAnalysis.result?.warning?.severity === 'CRITICAL') {
      blockScreenRef.current?.present();
    } else {
      create();
    }
  }, [addressAnalysis.result?.warning?.severity, blockScreenRef, create]);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (qrCode) {
      try {
        const value = decodeQrCodeAddress(qrCode);
        if (value) {
          onChangeAddress(value.address);
          if (value.isEip681) {
            showToast({ type: 'info', text: loc.send.eip681Warning });
          }
          if (value.options?.amount) {
            amountInputRef.current?.setAssetAmount(`${value.options.amount}`);
          }
        }
      } catch {
        onChangeAddress(qrCode);
      }
    }
  }, [onChangeAddress, qrCode, setParams]);

  const onScanRequest = () => navigation.navigate(Routes.SendQRScan, { ...params, routeBack: Routes.Send });

  const isLoading = isSimulationLoading || isFeeLoading || addressAnalysis.isLoading;

  const networks = useMemo(() => [network], [network]);

  const onConfirmUnsafeAction = () => {
    blockScreenRef.current?.close();
    create();
  };

  return (
    <GradientScreenView>
      <KeyboardAvoider style={styles.flex}>
        <ScrollView
          testID="SendScreen"
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.container}>
            {data.nft ? (
              <NftBlock nft={data.nft} currentAccount={currentAccount} containerStyle={styles.nft} />
            ) : (
              !!data.token && (
                <AmountInput
                  network={network}
                  token={data.token}
                  ref={amountInputRef}
                  currentFeeEstimate={currentFeeEstimate}
                  onToggleCurrency={handleToggleCurrency}
                />
              )
            )}
            <AddressSelector
              onValidName={onValidName}
              networks={networks}
              address={addressValue}
              onChangeAddress={onChangeAddress}
              onScanRequest={onScanRequest}
              showTitle
              addressAnalysis={addressAnalysis}
            />
            {selectedFee && feeEstimates && (
              <FeeSelector
                wallet={wallet}
                style={styles.feeSelector}
                feeEstimates={feeEstimates}
                options={fees}
                selected={selectedFee}
                onChange={setSelectedFee}
                price={feePrice}
                inputInFiat={inputInFiatCurrency}
              />
            )}
            {amount && selectedFee && feeEstimates && token && (
              <FeeAmountWarning
                transferToAmount={unitConverter.tokenUnit2Fiat(amount, feePrice)}
                feeAmount={unitConverter.smallestUnit2Fiat(feeEstimates[selectedFee].amount, wallet.nativeTokenDecimals, feePrice)}
              />
            )}
          </View>
        </ScrollView>
        <FloatingBottomContainer style={styles.buttonContainer}>
          <Button
            disabled={!isFormValid || !currentFeeEstimate || !transactionParams}
            loading={isLoading}
            size="large"
            text={loc._.continue}
            onPress={onContinue}
            testID="ContinueButton"
            accessibilityLabel="Create Transaction"
            color="kraken"
          />
        </FloatingBottomContainer>
      </KeyboardAvoider>
      {addressAnalysis.result?.warning && (
        <BlockScreenModal
          ref={blockScreenRef}
          title={loc.onChainSecurity.transactionFlagged}
          message={addressAnalysis.result.warning.message}
          onGoBack={() => blockScreenRef.current?.close()}
          onProceed={onConfirmUnsafeAction}
        />
      )}
    </GradientScreenView>
  );
};

export const SendScreen = (props: SendNavigationProps<'Send'>) => {
  return (
    <FormProvider requiredFields={'nftAssetId' in props.route.params ? ['address'] : ['address', 'amount']}>
      <Send {...props} />
    </FormProvider>
  );
};

export const navigationOptions: NativeStackNavigationOptions = { headerShown: false };

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  feeSelector: {
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 16,
  },
  nft: {
    marginBottom: 16,
  },
});

SendScreen.navigationOptions = {};
