import React, { type RefObject, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { APIResponseError } from '@/api/base/apiFactory';
import type { SwapQuoteResult } from '@/api/types';
import { BlockScreenModal } from '@/components/BlockScreen';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { ExpandableSheet, type ExpandableSheetMethods } from '@/components/Sheets';

import { TransactionBroadcastSuccess } from '@/components/Transaction';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { getImplForWallet } from '@/onChain/wallets/registry';

import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import type { Warning } from '@/types';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { waitForTransactionConfirmation } from '@/utils/waitForTransactionConfirmation';

import { BroadcastState } from '../../SwapScreen.constants';
import { SwapConfirmationDetails } from '../SwapConfirmationDetails';
import { SwapConfirmationPreview } from '../SwapConfirmationPreview';

import { useSwapContext } from '../SwapContext';

import type { SwapRouteUIData } from '../../types';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { getWarningFromSimulation } from '/modules/wallet-connect/utils';

type Props = {
  route: SwapRouteUIData;
  swapQuote: SwapQuoteResult;
  goBack: () => void;
  onBroadcastStateChange: (state: BroadcastState) => void;
  showExplainer: () => void;
  onSwapFailed: (insuffcientFunds?: boolean) => void;
};

const isInsufficientFundsError = (e: unknown) => {
  let message = '';
  if (e instanceof APIResponseError && e.errorContent?.message) {
    message = e.errorContent?.message;
  } else if (e instanceof Error) {
    message = e.message;
  }
  return message.includes('insufficient funds');
};

export const SwapConfirmationSheet = React.forwardRef<ExpandableSheetMethods, Props>(
  ({ route, swapQuote: { swapTxData, approvalTxData }, goBack, onBroadcastStateChange, onSwapFailed, ...props }, ref) => {
    const {
      refreshCountdownProgress,
      refreshFlashStyle,
      loadingState: [isSwapQuoteLoading],
      swapAvailableState: [swapAvailable],
    } = useSwapContext();
    const { getSeed } = useSecuredKeychain();
    const blockScreenRef = useRef<BottomSheetModalRef>(null);

    const [warning, setWarning] = useState<Warning>();

    const [broadcastState, setBroadcastState] = useState<BroadcastState>(BroadcastState.NONE);

    const getWalletStorage = useGetWalletStorage();

    useEffect(() => {
      onBroadcastStateChange(broadcastState);
    }, [broadcastState, onBroadcastStateChange]);

    const onConfirm = async (ignoreWarning = false) => {
      if (warning && !ignoreWarning) {
        blockScreenRef.current?.present();
        return;
      }

      setBroadcastState(BroadcastState.LOADING);
      try {
        if (!swapTxData) {
          throw new Error('No transaction data');
        }
        const wallet = route.sourceAsset.wallet;
        const { network, transport } = getImplForWallet(wallet);
        const walletStorage = await getWalletStorage(wallet);
        const seed = await getSeed('sign', true);

        const fees = await transport.getFeesEstimate(network);
        if (!fees.options.length) {
          throw new Error('Failed to get fee options');
        }

        const selectedFee = fees.options.length === 3 ? fees.options[1] : fees.options[0];
        if (approvalTxData) {
          const approvalTxPayload = {
            from: approvalTxData.fromAddress,
            to: approvalTxData.toAddress,
            data: approvalTxData.data,
          };
          const preparedApproval = await transport.prepareTransaction(network, wallet, walletStorage, approvalTxPayload, selectedFee, true);
          const approvalWarning = getWarningFromSimulation(preparedApproval.preventativeAction, preparedApproval.warnings);
          if (preparedApproval.isError) {
            throw new Error(`Simulation failed with reason: ${preparedApproval.failureReason}`);
          }
          if (approvalWarning?.severity === 'critical' && !ignoreWarning) {
            setBroadcastState(BroadcastState.WARNING);
            setWarning(approvalWarning);
            return;
          }
          const signedApproval = await network.signTransaction({ ...wallet, seed: { data: seed } }, preparedApproval.data);
          const approvalTxId = await transport.broadcastTransaction(network, signedApproval);
          await waitForTransactionConfirmation(wallet, approvalTxId);
        }

        const txPayload = {
          to: swapTxData.txTarget,
          data: swapTxData.data,
          value: parseInt(swapTxData.value, 16),
        };
        const prepared = await transport.prepareTransaction(network, wallet, walletStorage, txPayload, selectedFee, true);
        if (prepared.isError) {
          throw new Error(`Simulation failed with reason: ${prepared.failureReason}`);
        }
        const warning = getWarningFromSimulation(prepared.preventativeAction, prepared.warnings);
        if (warning?.severity === 'critical' && !ignoreWarning) {
          setBroadcastState(BroadcastState.WARNING);
          setWarning(warning);
          return;
        }
        const signed = await network.signTransaction({ ...wallet, seed: { data: seed } }, prepared.data);
        await transport.broadcastTransaction(network, signed);
        hapticFeedback.notificationSuccess();
        setBroadcastState(BroadcastState.SUCCESS);
      } catch (e) {
        if (isInsufficientFundsError(e)) {
          onSwapFailed(true);
          setBroadcastState(BroadcastState.FAILED);
        } else {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
          setBroadcastState(BroadcastState.NONE);
        }
        goBack();
      }
    };

    const isSuccess = broadcastState === BroadcastState.SUCCESS;
    const isBroadcastLoading = broadcastState === BroadcastState.LOADING;
    const successMarginBottom = useBottomElementSpacing(100);

    const dismissWarningAndGoBack = () => {
      blockScreenRef.current?.close();
      goBack();
    };

    const proceedWithWarning = () => {
      blockScreenRef.current?.close();
      onConfirm(true);
    };

    const onDimissSheet = () => {
      if (warning) {
        setBroadcastState(BroadcastState.NONE);
        setWarning(undefined);
      }
    };

    return (
      <>
        {!!warning && (
          <BlockScreenModal
            ref={blockScreenRef}
            title={loc.swap.confirmation.swapFlagged}
            message={warning.message}
            onGoBack={dismissWarningAndGoBack}
            onProceed={proceedWithWarning}
          />
        )}
        <ExpandableSheet
          isModal
          onDismiss={onDimissSheet}
          dismissible={broadcastState !== BroadcastState.LOADING}
          ref={ref as RefObject<ExpandableSheetMethods>}
          DetailsComponent={isSuccess ? null : <SwapConfirmationDetails route={route} refreshFlashStyle={refreshFlashStyle} isLoading={isSwapQuoteLoading} />}
          PreviewComponent={
            isSuccess ? (
              <TransactionBroadcastSuccess
                label={loc.swap.confirmation.initiated}
                estimatedTime={route.duration}
                style={[styles.successView, { marginBottom: successMarginBottom }]}
              />
            ) : (
              animatedProps => (
                <SwapConfirmationPreview
                  warning={warning}
                  refreshFlashStyle={refreshFlashStyle}
                  timeoutProgress={refreshCountdownProgress}
                  route={route}
                  isLoading={isSwapQuoteLoading}
                  {...props}
                  {...animatedProps}
                />
              )
            )
          }
          FloatingButtonsComponent={
            isSuccess ? null : (
              <FloatingBottomButtons
                useBottomInset={false}
                noAbsolutePosition
                style={[isBroadcastLoading && styles.buttonsContainerLoading]}
                primary={{
                  testID: 'ButtonConfirm',
                  text: loc.transactionDetails.confirmation.confirm,
                  onPress: () => onConfirm(false),
                  disabled: !swapAvailable,
                  loading: isBroadcastLoading || isSwapQuoteLoading,
                  style: [isBroadcastLoading && styles.primaryButtonLoading],
                  color: !isBroadcastLoading && warning?.severity === 'critical' ? 'red400' : undefined,
                }}
                secondary={
                  !isBroadcastLoading
                    ? {
                        testID: 'ButtonCancel',
                        text: loc.transactionDetails.confirmation.cancel,
                        onPress: goBack,
                      }
                    : undefined
                }
              />
            )
          }
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  buttons: {
    marginTop: 16,
  },
  successView: {
    position: 'relative',
    height: 180,
    marginTop: 100,
  },
  buttonsContainerLoading: {
    justifyContent: 'center',
  },
  primaryButtonLoading: {
    flex: 0,
    width: 64,
  },
});
