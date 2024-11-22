import { useCallback, useEffect, useRef, useState } from 'react';

import { PushNotifications } from '@/api/PushNotifications';
import type { FeeOption } from '@/api/types';
import type { ExpandableSheetMethods } from '@/components/Sheets';
import { ExpandableSheet } from '@/components/Sheets';
import { TransactionConfirmationFooter } from '@/components/Transaction';
import type { PreparedTransaction } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useIsPushPromptNeeded } from '@/realm/settings/useIsPushPromptNeeded';
import { useTransactionMutations } from '@/realm/transactions';
import { getCombinedTransactionId } from '@/realm/transactions/utils';
import { useRealmWalletById } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { showRecentActivity } from '@/screens/Home/components/homeAssetPanelEventEmitter';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { getBlockchainLabel } from '@/utils/getBlockchainLabel';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { navigationStyle } from '@/utils/navigationStyle';
import { tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { Details } from './components/Details';
import { FeeSelector } from './components/FeeSelector';
import { NetworkWarning } from './components/NetworkWarning';
import { Preview } from './components/Preview';

import { useAmounts } from './hooks/useAmounts';
import { useFeeEstimates } from './hooks/useFeeEstimates';
import { useRefreshingFeeOptions } from './hooks/useRefreshingFeeOptions';
import { useTransactionMethods } from './hooks/useTransactionMethods';

import { ScreenStage } from './types';

import type { AddressAnalysis } from './hooks/useAddressAnalysis';
import type { SendNavigationProps } from './SendRouter';
import type { TransactionParams } from './types';

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

export const SendConfirmScreen = ({ route, navigation }: SendNavigationProps<'SendConfirm'>) => {
  const params = route.params;
  const sheetRef = useRef<ExpandableSheetMethods>(null);

  const { transactionParams, walletId, simulatedTx, inputInFiat } = params;

  const { savePendingTransaction } = useTransactionMutations();
  const [stage, setStage] = useState<ScreenStage>(ScreenStage.ReadyToBroadcast);
  const isPushPromptNeeded = useIsPushPromptNeeded();

  const wallet = useRealmWalletById(walletId);
  const transactionMethods = useTransactionMethods(wallet, transactionParams);

  const { network } = getImplForWallet(wallet);
  const { selectedFee, setSelectedFee, fees } = useRefreshingFeeOptions(wallet, false, params.selectedFee.kind);

  const { feeEstimates } = useFeeEstimates(wallet, fees, true, simulatedTx, selectedFee);

  const amounts = useAmounts({
    nativeTokenCaipId: network.nativeTokenCaipId,
    walletId,
    selectedFee,
    feeEstimates,
    transactionParams,
  });

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

  useEffect(() => {
    sheetRef.current?.expand();
  }, []);

  const onCancel = () => sheetRef.current?.close();

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
          fee: amounts?.fee?.amount,
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
        price={amounts?.feePrice || 0}
        showTitle={false}
        showEstimatedTime={false}
        inputInFiat={inputInFiat}
      />
    );

  const onDismiss = () => {
    if (!isSuccess) {
      navigation.goBack();
      return;
    }

    if (params.fromUniversalSend) {
      showRecentActivity();
    }
    navigation.getParent()?.goBack();
  };

  return (
    <ExpandableSheet
      isModal
      dismissible={!isLoading}
      ref={sheetRef}
      onDismiss={onDismiss}
      PreviewComponent={
        <Preview
          transactionParams={transactionParams}
          amounts={amounts}
          wallet={wallet}
          recipientLabel={params.recipientLabel}
          senderLabel={params.senderLabel}
          addressAnalysis={params.addressAnalysis}
          isSuccess={isSuccess}
        />
      }
      DetailsComponent={
        stage !== ScreenStage.Sent ? (
          <Details
            transactionParams={transactionParams}
            amounts={amounts}
            recipientLabel={params.recipientLabel}
            walletType={wallet.type}
            selectedFee={selectedFee}
          />
        ) : undefined
      }
      FloatingButtonsComponent={
        <TransactionConfirmationFooter
          isLoading={isLoading}
          onConfirm={broadcast}
          onCancel={onCancel}
          hidden={isSuccess}
          feeSelector={renderFeeSelector()}
          primaryButtonColor={route.params.addressAnalysis?.result?.warning?.severity === 'CRITICAL' ? route.params.addressAnalysis?.accentColor : undefined}
          additionalInfo={network instanceof EVMNetwork && wallet.type !== 'ethereum' ? <NetworkWarning networkName={getBlockchainLabel(wallet.type)} /> : null}
        />
      }
    />
  );
};

SendConfirmScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
