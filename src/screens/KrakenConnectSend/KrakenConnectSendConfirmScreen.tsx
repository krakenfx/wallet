import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StyleSheet } from 'react-native';

import type { KrakenAssetSupported, KrakenWithdrawFee, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { ExpandableSheet, type ExpandableSheetMethods } from '@/components/Sheets';
import { TransactionConfirmationFooter } from '@/components/Transaction';
import { type WalletType } from '@/onChain/wallets/registry';
import { useTokensMutations } from '@/realm/tokens';
import { getCombinedTransactionId } from '@/realm/transactions';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { showRecentActivity } from '@/screens/Home/components/homeAssetPanelEventEmitter';
import { useReceiveAddress } from '@/screens/Receive/hooks';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { navigationStyle } from '@/utils/navigationStyle';

import { tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { ConfirmDetails } from './components/ConfirmDetails';
import { ConfirmPreview } from './components/ConfirmPreview';
import { TransferFee } from './components/TransferFee';
import { useFee } from './hooks/useFee';
import { useFundingAddresses } from './hooks/useFundingAddresses';
import { useSavePendingTransaction } from './hooks/useSavePendingTransaction';
import { useWithdrawMethod } from './hooks/useWithdrawMethod';
import { useKrakenConnectSendContext } from './KrakenConnectContext';

import type { KrakenConnectSendNavigationProps } from './KrakenConnectSendRouter';

import { handleError } from '/helpers/errorHandler';

export interface KrakenConnectSendConfirmParams {
  asset: KrakenAssetSupported;
}

const DELAY_TIMEOUT_TO_SHOW_SUCCESS_STATE = 4000;

export const KrakenConnectSendConfirmScreen = ({ route, navigation }: KrakenConnectSendNavigationProps<'KrakenConnectSendConfirm'>) => {
  const params = route.params;
  const { asset } = params;

  const sheetRef = useRef<ExpandableSheetMethods>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { transfer } = useWithdrawMethod();
  const [loading, setLoading] = useState<boolean>(false);

  const [feeWithToken, setFeeWithToken] = useState<KrakenWithdrawFee>();
  const [fundingAddressId, setFundingAddressId] = useState<string>('');

  const { getOrCreateFundingAddress } = useFundingAddresses();
  const { savePendingTxFromKrakenExchange } = useSavePendingTransaction();
  const { getFee } = useFee();
  const { addTokenToRealm } = useTokensMutations();

  useEffect(() => {
    sheetRef.current?.expand();
  }, []);

  const {
    withdrawMethodState: [withdrawMethod],
    amountState: [amount],
    amountFiatState: [amountFiat],
    isInputInFiatCurrencyState: [isInputInFiatCurrency],
    walletNetworkType,
  } = useKrakenConnectSendContext();

  const wallet = useWalletByType(walletNetworkType as WalletType);
  const receiveAddress = useReceiveAddress(wallet) || '';

  useEffect(() => {
    const fetchFee = async (withdrawMethod: KrakenWithdrawMethod) => {
      const fee_ = await getFee(amount, withdrawMethod.method_id);
      if (fee_) {
        setFeeWithToken(fee_);
      }
    };
    const fetchAddressId = async (withdrawMethod: KrakenWithdrawMethod) => {
      const fundingAddressId_ = await getOrCreateFundingAddress(withdrawMethod.network_id, receiveAddress);
      if (fundingAddressId_) {
        setFundingAddressId(fundingAddressId_);
      }
    };
    const fetchAndSetAllNeededData = async () => {
      if (!withdrawMethod || !receiveAddress) {
        return;
      }
      setLoading(true);

      try {
        await fetchAddressId(withdrawMethod);
        await fetchFee(withdrawMethod);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetAllNeededData();
  }, [amount, getFee, getOrCreateFundingAddress, receiveAddress, withdrawMethod]);

  const fee = useMemo(() => feeWithToken?.fee || '', [feeWithToken]);

  const onDismiss = useCallback(() => {
    if (isSuccess) {
      showRecentActivity();
      navigation.getParent()?.goBack();
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  }, [isSuccess, navigation]);

  const onCancel = () => sheetRef.current?.close();

  const onSucceed = useCallback(() => {
    setTimeout(() => {
      sheetRef.current?.close();
    }, DELAY_TIMEOUT_TO_SHOW_SUCCESS_STATE);
  }, [sheetRef]);

  const handleConfirm = useCallback(async () => {
    if (!fundingAddressId || !feeWithToken || !amount || !withdrawMethod) {
      return;
    }
    try {
      const result = await transfer({
        addressId: fundingAddressId,
        feeToken: feeWithToken?.fee_token,
        amount,
        assetSymbol: asset.symbol,
        methodId: withdrawMethod.method_id,
      });
      if (result?.transaction_id) {
        const refid = result.transaction_id;
        const { shouldCreateRealmToken, remoteToken } = savePendingTxFromKrakenExchange({
          tx: {
            id: getCombinedTransactionId(wallet.id, refid),
            transactionId: refid,
            walletId: wallet.id,
            amount: tokenUnit2SmallestUnit(amount, asset.metadata.decimals).toString(10),
            kind: 'receive',
            type: 'token',
            to: receiveAddress,
            from: 'Kraken',
            time: Math.round(new Date().getTime() / 1000),
            fee: tokenUnit2SmallestUnit(feeWithToken.fee, asset.metadata.decimals).toString(10),
            additionalStatus: 'kraken-connect-to-wallet',
          },
          wallet,
          krakenAsset: asset,
        });
        if (shouldCreateRealmToken && remoteToken) {
          addTokenToRealm(remoteToken, wallet);
        }
      }

      setIsSuccess(true);
      hapticFeedback.notificationSuccess();
      onSucceed();
    } catch (error) {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    }
  }, [
    addTokenToRealm,
    amount,
    asset,
    feeWithToken,
    fundingAddressId,
    onSucceed,
    receiveAddress,
    savePendingTxFromKrakenExchange,
    transfer,
    wallet,
    withdrawMethod,
  ]);

  if (!withdrawMethod) {
    return null;
  }

  return (
    <ExpandableSheet
      ref={sheetRef}
      dismissible
      onDismiss={onDismiss}
      PreviewComponent={
        <ConfirmPreview asset={asset} amountFiat={amountFiat} amount={amount} network={walletNetworkType as WalletType} isSuccess={isSuccess} />
      }
      DetailsComponent={
        !isSuccess && (
          <ConfirmDetails
            isLoading={loading}
            address={receiveAddress}
            fee={fee}
            amountFiat={amountFiat}
            asset={asset}
            amount={amount}
            withdrawMethod={withdrawMethod}
          />
        )
      }
      FloatingButtonsComponent={
        <TransactionConfirmationFooter
          isLoading={loading}
          onConfirm={handleConfirm}
          onCancel={onCancel}
          hidden={isSuccess}
          isKrakenConnectTransfer
          feeSelector={<TransferFee fee={fee} isInputInFiatCurrency={isInputInFiatCurrency} asset={asset} style={styles.fee} isLoading={loading} />}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  fee: {
    paddingHorizontal: 0,
  },
});

KrakenConnectSendConfirmScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
