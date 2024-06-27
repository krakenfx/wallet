import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PushNotifications } from '@/api/PushNotifications';
import { FeeOption } from '@/api/types';
import { AddressDisplay } from '@/components/AddressDisplay';
import { DoubleRow } from '@/components/DoubleRow';
import { Label } from '@/components/Label';
import navigationStyle from '@/components/navigationStyle';
import { NetworkIcon } from '@/components/NetworkIcon';
import { ExpandableSheet, ExpandableSheetMethods } from '@/components/Sheets';
import {
  TransactionAmount,
  TransactionBroadcastSuccess,
  TransactionConfirmationFooter,
  TransactionHeader,
  TransactionNftPreview,
  TransactionPath,
  TransactionPathBTC,
} from '@/components/Transaction';
import { TransactionDetailItem } from '@/components/Transaction';
import { PreparedTransaction } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useIsPushPromptNeeded } from '@/realm/settings/useIsPushPromptNeeded';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useTransactionMutations } from '@/realm/transactions';
import { getCombinedTransactionId } from '@/realm/transactions/utils';
import { useRealmWalletById } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { showRecentActivity } from '@/screens/Home/components/homeAssetPanelEventEmitter';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { getWalletName } from '@/utils/getWalletName';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { tokenUnit2SmallestUnit, unitConverter } from '@/utils/unitConverter';

import { AddressAnalysisInfo } from './components/AddressAnalysisInfo';
import { FeeSelector } from './components/FeeSelector';
import { NetworkWarning } from './components/NetworkWarning';
import { AddressAnalysis } from './hooks/useAddressAnalysis';
import { useFeeEstimates } from './hooks/useFeeEstimates';
import { useRefreshingFeeOptions } from './hooks/useRefreshingFeeOptions';
import { useTransactionMethods } from './hooks/useTransactionMethods';
import { SendNavigationProps } from './SendRouter';
import { TransactionParams } from './types';
import { BTCfeeOptionToString } from './utils/BTCfeeOptionToString';
import { feeOptionToString } from './utils/feeOptionToString';
import { totalFeeToFiatString } from './utils/totalFeeToFiatString';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type SendConfirmRouteParams = {
  walletId: string;
  transactionParams: TransactionParams;
  simulatedTx: PreparedTransaction;
  selectedFee: FeeOption;
  senderLabel: string;
  recipientLabel: string;
  inputInFiat?: boolean;
  addressAnalysis?: AddressAnalysis;
  fromUniversalSend?: boolean;
};

enum ScreenStage {
  ReadyToBroadcast,
  Broadcasting,
  Sent,
}

export const SendConfirmScreen = ({ route, navigation }: SendNavigationProps<'SendConfirm'>) => {
  const params = route.params;
  const sheetRef = useRef<ExpandableSheetMethods>(null);
  const { currency } = useAppCurrency();

  const { transactionParams, walletId, simulatedTx, inputInFiat } = params;

  const { savePendingTransaction } = useTransactionMutations();
  const [stage, setStage] = useState<ScreenStage>(ScreenStage.ReadyToBroadcast);
  const tokenPrice = useTokenPrice({ assetId: transactionParams.type !== 'nft' ? transactionParams.token.assetId : '' });
  const isPushPromptNeeded = useIsPushPromptNeeded();

  const wallet = useRealmWalletById(walletId);
  const transactionMethods = useTransactionMethods(wallet, transactionParams);

  const { network } = getImplForWallet(wallet);
  const { selectedFee, setSelectedFee, fees } = useRefreshingFeeOptions(wallet, false, params.selectedFee.kind);

  const { feeEstimates } = useFeeEstimates(wallet, fees, true, simulatedTx, selectedFee);

  const feePrice = useTokenPrice({ assetId: network.nativeTokenCaipId }) ?? 0;

  const amounts = useMemo(() => {
    if (!feeEstimates || !selectedFee) {
      return;
    }

    return {
      amountFiat:
        transactionParams.type !== 'nft' && tokenPrice
          ? formatCurrency(unitConverter.tokenUnit2Fiat(new BigNumber(transactionParams.amount), tokenPrice).toFixed(2), { currency })
          : undefined,
      feeFiat: totalFeeToFiatString(currency, feeEstimates[selectedFee], wallet, feePrice),
      fee: feeEstimates[selectedFee],
    };
  }, [currency, feeEstimates, feePrice, selectedFee, tokenPrice, transactionParams, wallet]);

  const onSucceed = useCallback(
    (txId: string) => {
      setTimeout(() => {
        sheetRef.current?.close();
      }, 4000);
      setTimeout(() => {
        if (isPushPromptNeeded) {
          navigation.navigate(Routes.TriggeredPushPrompt, {
            transactionIds: [txId],
          });
        }
      }, 5500);
    },
    [isPushPromptNeeded, navigation],
  );

  const { getSeed } = useSecuredKeychain();

  const broadcast = useCallback(async () => {
    try {
      const fee = fees.find(o => o.kind === selectedFee);
      if (!transactionMethods || !fee) {
        return;
      }
      setStage(ScreenStage.Broadcasting);
      const seed = await getSeed('sign');
      if (!seed) {
        setStage(ScreenStage.ReadyToBroadcast);
        return;
      }

      const request = await transactionMethods.create();
      const prepared = await transactionMethods.prepare(request, fee, true);
      const signed = await transactionMethods.sign(prepared, seed);

      const txId = await transactionMethods.broadcast(signed);

      savePendingTransaction(
        {
          id: getCombinedTransactionId(walletId, txId),
          transactionId: txId,
          walletId,
          tokenId: transactionParams.type !== 'nft' ? transactionParams.token.id : undefined,
          amount:
            'amount' in transactionParams
              ? tokenUnit2SmallestUnit(transactionParams.amount, transactionParams.token.metadata.decimals).toString(10)
              : undefined,
          kind: 'send',
          type: transactionParams.type,
          to: transactionParams.address,
          time: Math.round(new Date().getTime() / 1000),
          fee: amounts?.fee.amount,
        },
        wallet,
      );

      const pushInstance = PushNotifications.getInstance();
      if (await pushInstance.getDeviceToken()) {
        await pushInstance.subscribeTransactionsToPushNotifications([txId]);
      }
      setStage(ScreenStage.Sent);
      onSucceed(txId);

      hapticFeedback.notificationSuccess();
    } catch (error) {
      setStage(ScreenStage.ReadyToBroadcast);
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.send.sendError });
    }
  }, [fees, transactionMethods, getSeed, amounts?.fee, savePendingTransaction, walletId, transactionParams, wallet, onSucceed, selectedFee]);

  const isLoading = stage === ScreenStage.Broadcasting;
  const isSuccess = stage === ScreenStage.Sent;
  const renderPreview = () => {
    return (
      <View>
        <View style={[isSuccess && styles.hidden]}>
          <TransactionHeader heading={loc.send.confirmSend} />
          {transactionParams.type === 'nft' ? (
            <TransactionNftPreview nft={transactionParams.nft} />
          ) : wallet.type === 'HDsegwitBech32' ? (
            <DoubleRow
              iconName="chevron-down"
              renderTop={({ containerStyle }) => (
                <TransactionAmount
                  tokenIconProps={{ wallet, tokenId: transactionParams.token.assetId, tokenSymbol: transactionParams.token.metadata.symbol }}
                  assetAmount={`-${formatTokenAmount(transactionParams.amount, { compact: true, currency })}`}
                  assetFiatAmount={amounts?.amountFiat ? `-${amounts.amountFiat}` : undefined}
                  assetNetwork={wallet.type}
                  assetSymbol={transactionParams.token.metadata.symbol}
                  containerStyle={containerStyle}
                />
              )}
              renderBottom={({ containerStyle }) => <TransactionPathBTC to={params.recipientLabel} containerStyle={containerStyle} />}
            />
          ) : (
            <>
              <TransactionAmount
                tokenIconProps={{ wallet, tokenId: transactionParams.token.assetId, tokenSymbol: transactionParams.token.metadata.symbol }}
                assetAmount={`-${formatTokenAmount(transactionParams.amount, { compact: true, currency })}`}
                assetFiatAmount={amounts?.amountFiat ? `-${amounts.amountFiat}` : undefined}
                assetNetwork={wallet.type}
                assetSymbol={transactionParams.token.metadata.symbol}
              />
              <TransactionPath from={params.senderLabel} to={params.recipientLabel} />
            </>
          )}
          {route.params.addressAnalysis?.result?.warning?.severity === 'CRITICAL' && (
            <AddressAnalysisInfo animated={false} addressAnalysis={route.params.addressAnalysis} style={styles.addressAnalysis} />
          )}
        </View>
        {isSuccess && <TransactionBroadcastSuccess />}
      </View>
    );
  };

  const renderDetails = () => {
    return (
      <View style={styles.details}>
        {transactionParams.type !== 'nft' && (
          <TransactionDetailItem title={loc.transactionDetails.amount}>
            <Label>
              {`${transactionParams.amount} ${transactionParams.token.metadata.symbol} `}
              <Label type="regularMonospace" color="light75">
                -{amounts?.amountFiat}
              </Label>
            </Label>
          </TransactionDetailItem>
        )}
        <TransactionDetailItem title={loc.transactionDetails.recipient}>
          <AddressDisplay
            address={transactionParams.address}
            ensName={params.recipientLabel !== transactionParams.address ? params.recipientLabel : undefined}
            hasSpaces
            boldPrefix
          />
        </TransactionDetailItem>
        <TransactionDetailItem title={loc.formatString(loc.transactionDetails.networkFee, { network: getWalletName(wallet.type) })}>
          <View style={styles.feeRow}>
            <NetworkIcon networkName={wallet.type} size={16} />
            <Label>
              {selectedFee ? (wallet.type === 'HDsegwitBech32' ? BTCfeeOptionToString(selectedFee) : feeOptionToString(selectedFee)) : ''} - {amounts?.feeFiat}
            </Label>
          </View>
        </TransactionDetailItem>
      </View>
    );
  };

  const renderFeeSelector = () =>
    selectedFee &&
    feeEstimates && (
      <FeeSelector
        disabled
        compact
        wallet={wallet}
        feeEstimates={feeEstimates}
        options={fees}
        selected={selectedFee}
        onChange={setSelectedFee}
        price={feePrice}
        showTitle={false}
        showEstimatedTime={false}
        inputInFiat={inputInFiat}
      />
    );

  const onDismiss = () => {
    if (isSuccess) {
      if (params.fromUniversalSend) {
        showRecentActivity();
      }
      navigation.getParent()?.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ExpandableSheet
      dismissible={!isLoading}
      ref={sheetRef}
      onDismiss={onDismiss}
      floatingButtonsProps={{
        isLoading,
        onConfirm: broadcast,
        hidden: isSuccess,
        feeSelector: renderFeeSelector(),
        primaryButtonColor: route.params.addressAnalysis?.result?.warning?.severity === 'CRITICAL' ? route.params.addressAnalysis?.accentColor : undefined,
        additionalInfo: network instanceof EVMNetwork && wallet.type !== 'ethereum' ? <NetworkWarning networkName={getWalletName(wallet.type)} /> : null,
      }}
      PreviewComponent={renderPreview}
      FloatingButtonsComponent={TransactionConfirmationFooter}
      DetailsComponent={stage === ScreenStage.Sent ? null : renderDetails}
    />
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  details: {
    marginTop: 8,
  },
  feeRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  addressAnalysis: {
    marginTop: 8,
  },
});

SendConfirmScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
