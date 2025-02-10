import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import type { FeeOption } from '@/api/types';
import { BlockScreenSheet } from '@/components/BlockScreen';
import { CardWarningFromWarning } from '@/components/CardWarning';

import { ExpandableSheet } from '@/components/Sheets';
import type { PreparedTransaction } from '@/onChain/wallets/base';
import type { NavigationProps } from '@/Routes';

import type { Warning } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { ConfirmationFooterWithFeeSelector } from './components/ConfirmationFooterWithFeeSelector';
import { ExpandedDetailsContent } from './components/ExpandedDetailsContent';
import { GenericSignContent } from './components/GenericSignContent';
import { Header } from './components/Header';

import loc from '/loc';
import type { DefinitionList } from '/modules/wallet-connect/types';

export interface WalletConnectSignRequest_GenericTransactionParams {
  walletId: string;
  metadata: {
    imageUrl?: string;
    name: string;
    url: string;
  };
  content: DefinitionList;
  detailsContent: DefinitionList;
  preparedTransaction: PreparedTransaction;
  hideFeeSelector?: boolean;
  onApprove: (fee: FeeOption | null) => void;
  onReject: () => void;
  warning?: Warning;
}

export const WalletConnectSignRequest_GenericTransactionScreen = ({ route, navigation }: NavigationProps<'WalletConnectSignRequest_GenericTransaction'>) => {
  const isOnline = useIsOnline();
  const { walletId, metadata, onReject, onApprove, hideFeeSelector = false, preparedTransaction, warning, content, detailsContent } = route.params;
  const { goBack } = navigation;
  const { height } = useWindowDimensions();

  const isCriticalWarning = warning?.severity === 'critical';
  const blockScreenMessage = isCriticalWarning ? warning.message : '';
  const [showBlockScreen, setShowBlockScreen] = useState(isCriticalWarning);
  const [hasScrolledToEndOfContent, setHasScrolledToEndOfContent] = useState(content.length === 0);

  const handleApprove = (feeOption: FeeOption | null) => {
    onApprove(feeOption);
    goBack();
  };

  const handleReject = () => {
    if (isOnline) {
      onReject();
    }
    goBack();
  };

  if (showBlockScreen) {
    return (
      <BlockScreenSheet
        onGoBack={handleReject}
        onProceed={() => setShowBlockScreen(false)}
        title={loc.onChainSecurity.transactionFlagged}
        message={blockScreenMessage}
      />
    );
  }

  let offlineWarning: Warning | undefined;
  if (!isOnline) {
    offlineWarning = {
      severity: 'critical',
      heading: loc.errors.offline,
      message: loc.errors.offlineRetry,
    };
  }

  return (
    <ExpandableSheet
      dismissible
      onDismiss={handleReject}
      PreviewComponent={
        <View>
          <Header url={metadata.url} icon={metadata.imageUrl} name={metadata.name} heading={loc.appSignRequest.contractInteraction} />

          <View style={[styles.contentContainer, { maxHeight: height * 0.3 }]}>
            {Boolean(offlineWarning || warning) && <CardWarningFromWarning warning={(offlineWarning || warning) as Warning} />}
            {content.length > 0 && <GenericSignContent content={content} setHasScrolledToEndOfContent={setHasScrolledToEndOfContent} />}
          </View>
        </View>
      }
      DetailsComponent={<ExpandedDetailsContent content={detailsContent} />}
      FloatingButtonsComponent={
        <ConfirmationFooterWithFeeSelector
          walletId={walletId}
          disableConfirmationButton={!hasScrolledToEndOfContent || !isOnline}
          hideFeeSelector={hideFeeSelector}
          isCriticalWarning={isCriticalWarning}
          preparedTransaction={preparedTransaction}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 12,
  },
});

WalletConnectSignRequest_GenericTransactionScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
