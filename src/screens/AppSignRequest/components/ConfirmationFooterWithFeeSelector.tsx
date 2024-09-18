import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FeeOption } from '@/api/types';
import { Label } from '@/components/Label';
import { PreparedTransaction } from '@/onChain/wallets/base';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useRealmWalletById } from '@/realm/wallets';

import { FeeSelector } from '@/screens/Send/components/FeeSelector';
import { useFeeEstimates } from '@/screens/Send/hooks/useFeeEstimates';
import { useRefreshingFeeOptions } from '@/screens/Send/hooks/useRefreshingFeeOptions';
import { getDefaultFeeOption } from '@/screens/Send/utils/getDefaultFeeOption';

import { AccountName } from './AccountName';
import { ConfirmationFooter } from './ConfirmationFooter';
import { Info } from './Info';

import loc from '/loc';

interface ConfirmationFooterWithFeeSelectorProps {
  walletId: string;
  disableConfirmationButton?: boolean;
  hideFeeSelector: boolean;
  isCriticalWarning: boolean;
  preparedTransaction: PreparedTransaction;
  handleApprove: (feeOption: FeeOption | null) => void;
  handleReject: () => void;
}

export const ConfirmationFooterWithFeeSelector: React.FC<ConfirmationFooterWithFeeSelectorProps> = ({
  walletId,
  preparedTransaction,
  isCriticalWarning,
  hideFeeSelector,
  disableConfirmationButton = false,
  handleApprove,
  handleReject,
}) => {
  const wallet = useRealmWalletById(walletId);
  const defaultFeeOption = getDefaultFeeOption(wallet);
  const price = useTokenPrice({ assetId: wallet.nativeTokenCaipId });
  const { selectedFee, setSelectedFee, fees } = useRefreshingFeeOptions(wallet, false, defaultFeeOption);
  const { feeEstimates } = useFeeEstimates(wallet, fees, true, preparedTransaction, selectedFee);
  const showFeeSelector = !!(!hideFeeSelector && selectedFee && feeEstimates);

  const onApprove = () => {
    const feeOption = fees.find(fee => fee.kind === selectedFee) ?? null;
    handleApprove(feeOption);
  };

  return (
    <ConfirmationFooter
      content={
        <View style={styles.infoContainer}>
          <Info
            cells={
              showFeeSelector
                ? [
                    <Label type="boldCaption1" color="light75">
                      {loc.send.network_fee}
                    </Label>,
                    <FeeSelector
                      compact
                      wallet={wallet}
                      selected={selectedFee}
                      onChange={setSelectedFee}
                      options={fees}
                      feeEstimates={feeEstimates}
                      showEstimatedTime={false}
                      showTitle={false}
                      inputInFiat
                      price={price}
                      key="info_1"
                    />,
                  ]
                : [<AccountName accountIdx={wallet.accountIdx ?? -1 } key="info_0" />]
            }
          />
        </View>
      }
      disableConfirmationButton={disableConfirmationButton}
      onApprove={onApprove}
      onReject={handleReject}
      isCriticalWarning={isCriticalWarning}
    />
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: 24,
  },
});
