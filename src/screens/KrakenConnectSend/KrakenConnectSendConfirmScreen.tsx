import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { StyleSheet } from 'react-native';

import { serializeError } from 'serialize-error';

import type { KrakenAssetSupported, KrakenWithdrawFee, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { ExpandableSheet, type ExpandableSheetMethods } from '@/components/Sheets';
import { TransactionConfirmationFooter } from '@/components/Transaction';
import { type WalletType } from '@/onChain/wallets/registry';
import { getTokenIdFromChainIdAndAssetId } from '@/onChain/wallets/utils/ChainAgnostic';
import { useTokensMutations } from '@/realm/tokens';
import { TRANSACTION_STATUS_KRAKEN_CONNECT, getCombinedTransactionId } from '@/realm/transactions';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { showRecentActivity } from '@/screens/Home/components/homeAssetPanelEventEmitter';
import { getkBtcAssetId, isBtcOnEvm } from '@/screens/KrakenConnectSend/utils';
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

import { biometricUnlock } from '/helpers/biometric-unlock';
import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransferLoading, setIsTransferLoading] = useState<boolean>(false);

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

  const isAssetKBTC = withdrawMethod ? isBtcOnEvm(asset.symbol, withdrawMethod.network_id) : false;

  const wallet = useWalletByType(walletNetworkType as WalletType);
  const receiveAddress = useReceiveAddress(wallet) || '';

  useEffect(() => {
    const fetchFee = async (withdrawMethod: KrakenWithdrawMethod) => {
      try {
        const fee_ = await getFee(amount, withdrawMethod.method_id);
        if (fee_) {
          setFeeWithToken(fee_);
        }
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.krakenConnect.errors.getFee });
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
      setIsLoading(true);

      try {
        await fetchAddressId(withdrawMethod);
        await fetchFee(withdrawMethod);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      } finally {
        setIsLoading(false);
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
    if (!(await biometricUnlock())) {
      handleError('[Transfer confirm]: AppLock failed', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.krakenConnect.errors.transferAppLockFailure });
      return;
    }
    let result;
    try {
      setIsTransferLoading(true);
      const tokenId = getTokenIdFromChainIdAndAssetId(wallet.caipId, asset.assetId.split('/')[1]);
      result = await transfer({
        addressId: fundingAddressId,
        feeToken: feeWithToken?.fee_token,
        amount,
        assetSymbol: asset.symbol,
        methodId: withdrawMethod.method_id,
        tokenId,
      });
    } catch (e) {
      handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: JSON.stringify(serializeError(e)) });
      return;
    } finally {
      setIsTransferLoading(false);
    }
    try {
      if (result?.transaction_id) {
        const krakenAsset = isAssetKBTC ? { ...asset, assetId: getkBtcAssetId(wallet.type), metadata: { ...asset.metadata, symbol: 'kBTC' } } : asset;
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
            additionalStatus: TRANSACTION_STATUS_KRAKEN_CONNECT,
          },
          wallet,
          krakenAsset,
        });
        if (shouldCreateRealmToken && remoteToken) {
          addTokenToRealm(remoteToken, wallet);
        }
      }
    } catch (error) {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    }

    setIsSuccess(true);
    hapticFeedback.notificationSuccess();
    onSucceed();
  }, [
    addTokenToRealm,
    amount,
    asset,
    feeWithToken,
    fundingAddressId,
    isAssetKBTC,
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
        <ConfirmPreview
          asset={asset}
          amountFiat={amountFiat}
          amount={amount}
          network={walletNetworkType as WalletType}
          isKBTC={isAssetKBTC}
          isSuccess={isSuccess}
        />
      }
      DetailsComponent={
        !isSuccess && (
          <ConfirmDetails
            isLoading={isLoading}
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
          isLoading={isTransferLoading}
          primaryButtonProps={{ disabled: isLoading }}
          onConfirm={handleConfirm}
          onCancel={onCancel}
          hidden={isSuccess}
          isKrakenConnectTransfer
          feeSelector={<TransferFee fee={fee} isInputInFiatCurrency={isInputInFiatCurrency} asset={asset} style={styles.fee} isLoading={isLoading} />}
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
