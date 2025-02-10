import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import type { FeeOption } from '@/api/types';
import { BlockScreenSheet } from '@/components/BlockScreen';
import { CardWarningFromWarning } from '@/components/CardWarning';
import { ExpandableSheet } from '@/components/Sheets';
import type { PreparedTransaction } from '@/onChain/wallets/base';
import { useRealmWalletById } from '@/realm/wallets';
import type { NavigationProps } from '@/Routes';
import type { Warning } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';
import { useIsOnline } from '@/utils/useConnectionManager';

import { AssetContent } from './components/AssetContent';
import { ConfirmationFooterWithFeeSelector } from './components/ConfirmationFooterWithFeeSelector';
import { ExpandedDetailsContent } from './components/ExpandedDetailsContent';
import { Header } from './components/Header';

import loc from '/loc';
import type { DefinitionList, TransactionContent } from '/modules/wallet-connect/types';

export interface WalletConnectSignRequest_StructuredTransactionParams {
  walletId: string;
  metadata: {
    imageUrl?: string;
    name?: string;
    url?: string;
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
  const isOnline = useIsOnline();
  const {
    walletId,
    metadata,
    onReject,
    onApprove,
    transactionTitle,
    hideFeeSelector = false,
    content,
    detailsContent,
    preparedTransaction,
    warning,
  } = route.params;
  const wallet = useRealmWalletById(walletId);
  const { goBack } = navigation;
  const { height } = useWindowDimensions();
  const isCriticalWarning = warning?.severity === 'critical';
  const blockScreenMessage = isCriticalWarning ? warning.message : '';
  const [showBlockScreen, setShowBlockScreen] = useState(isCriticalWarning);

  const hasSubtitle = 'subtitle' in content;

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
          <Header
            url={metadata.url}
            coinType={wallet.type}
            icon={metadata.imageUrl}
            name={metadata.name}
            heading={transactionTitle}
            subheading={(hasSubtitle && content.subtitle) || ''}
          />
          <View style={[styles.contentContainer, { maxHeight: height * 0.3, marginTop: hasSubtitle ? 12 : 16 }]}>
            {Boolean(offlineWarning || warning) && <CardWarningFromWarning warning={(offlineWarning || warning) as Warning} />}
            <AssetContent content={content} />
          </View>
        </View>
      }
      DetailsComponent={detailsContent.length > 0 && <ExpandedDetailsContent content={detailsContent} />}
      FloatingButtonsComponent={
        <ConfirmationFooterWithFeeSelector
          walletId={walletId}
          hideFeeSelector={hideFeeSelector}
          isCriticalWarning={isCriticalWarning}
          preparedTransaction={preparedTransaction}
          handleApprove={handleApprove}
          handleReject={handleReject}
          disableConfirmationButton={!isOnline}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

WalletConnectSignRequest_StructuredTransactionScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
