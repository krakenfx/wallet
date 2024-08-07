import React, { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { FeeOption } from '@/api/types';
import { BlockScreenSheet } from '@/components/BlockScreen';
import { CardWarningFromWarning } from '@/components/CardWarning';
import { Label } from '@/components/Label';
import { ExpandableSheet } from '@/components/Sheets';
import { PreparedTransaction } from '@/onChain/wallets/base';
import { useTokenPrice } from '@/realm/tokenPrice';
import { useRealmWalletById } from '@/realm/wallets';
import { NavigationProps } from '@/Routes';
import { FeeSelector } from '@/screens/Send/components/FeeSelector';
import { useFeeEstimates } from '@/screens/Send/hooks/useFeeEstimates';
import { useRefreshingFeeOptions } from '@/screens/Send/hooks/useRefreshingFeeOptions';
import { getDefaultFeeOption } from '@/screens/Send/utils/getDefaultFeeOption';
import { Warning } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';

import { AccountName } from './components/AccountName';
import { AssetContent } from './components/AssetContent';
import { ConfirmationFooter } from './components/ConfirmationFooter';
import { ExpandedDetailsContent } from './components/ExpandedDetailsContent';
import { Header } from './components/Header';
import { Info } from './components/Info';

import loc from '/loc';
import { DefinitionList, TransactionContent } from '/modules/wallet-connect/types';

export interface WalletConnectSignRequest_StructuredTransactionParams {
  walletId: string;
  metadata: {
    imageUrl: string;
    name: string;
    url: string;
  };
  transactionTitle: string | string[];
  content: TransactionContent;
  detailsContent: DefinitionList;
  preparedTransaction: PreparedTransaction;
  hideFeeSelector?: boolean;
  onApprove: (fee: FeeOption | null) => void;
  onReject: () => void;
  warning?: Warning;
}

export const WalletConnectSignRequest_StructuredTransactionScreen = ({
  route,
  navigation,
}: NavigationProps<'WalletConnectSignRequest_StructuredTransaction'>) => {
  const { walletId, metadata, onReject, onApprove, transactionTitle, hideFeeSelector, content, detailsContent, preparedTransaction, warning } = route.params;
  const wallet = useRealmWalletById(walletId);
  const { goBack } = navigation;
  const { height } = useWindowDimensions();
  const isCriticalWarning = warning?.severity === 'critical';
  const blockScreenMessage = isCriticalWarning ? warning.message : '';
  const [showBlockScreen, setShowBlockScreen] = useState(isCriticalWarning);

  const hasSubtitle = 'subtitle' in content;

  const price = useTokenPrice({ assetId: wallet.nativeTokenCaipId });

  const defaultFeeOption = getDefaultFeeOption(wallet);

  const { selectedFee, setSelectedFee, fees } = useRefreshingFeeOptions(wallet, false, defaultFeeOption);

  const { feeEstimates } = useFeeEstimates(wallet, fees, true, preparedTransaction, selectedFee);

  const handleApprove = useCallback(() => {
    const feeOption = fees.find(fee => fee.kind === selectedFee) ?? null;

    onApprove(feeOption);
    goBack();
  }, [fees, goBack, onApprove, selectedFee]);
  const handleReject = useCallback(() => {
    onReject();
    goBack();
  }, [goBack, onReject]);

  const renderPreview = () => {
    return (
      <View>
        <Header
          url={metadata.url}
          coinType={wallet.type}
          icon={metadata.imageUrl}
          name={metadata.name}
          heading={transactionTitle}
          subheading={(hasSubtitle && content.subtitle) || ''}
        />
        <View style={[styles.contentContainer, { maxHeight: height * 0.3, marginTop: hasSubtitle ? 12 : 16 }]}>
          {warning && <CardWarningFromWarning warning={warning} />}
          <AssetContent content={content} />
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    return <ExpandedDetailsContent content={detailsContent} />;
  };

  const renderFooter = () => {
    const showFeeSelector = !!(!hideFeeSelector && selectedFee && feeEstimates);

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
                  : [<AccountName accountIdx={wallet.accountIdx ?? -1} key="info_0" />]
              }
            />
          </View>
        }
        onApprove={handleApprove}
        onReject={handleReject}
        isCriticalWarning={isCriticalWarning}
      />
    );
  };

  return showBlockScreen ? (
    <BlockScreenSheet
      onGoBack={handleReject}
      onProceed={() => setShowBlockScreen(false)}
      title={loc.onChainSecurity.transactionFlagged}
      message={blockScreenMessage}
    />
  ) : (
    <ExpandableSheet
      dismissible
      onDismiss={handleReject}
      PreviewComponent={renderPreview}
      DetailsComponent={renderDetails}
      FloatingButtonsComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoContainer: {
    marginHorizontal: 24,
  },
});

WalletConnectSignRequest_StructuredTransactionScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
