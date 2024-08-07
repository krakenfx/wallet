import React, { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BlockScreenSheet } from '@/components/BlockScreen';
import { CardWarningFromWarning } from '@/components/CardWarning';
import { ExpandableSheet } from '@/components/Sheets';
import { NavigationProps } from '@/Routes';
import { Warning } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';

import { AccountName } from './components/AccountName';
import { ConfirmationFooter } from './components/ConfirmationFooter';
import { ExpandedDetailsContent } from './components/ExpandedDetailsContent';
import { GenericSignContent } from './components/GenericSignContent';
import { Header, getMessageHeading } from './components/Header';
import { Info } from './components/Info';

import loc from '/loc';

import { DefinitionList, GenericMessage } from '/modules/wallet-connect/types';

export interface WalletConnectSignRequest_GenericMessageParams {
  accountIdx: number;
  metadata: {
    imageUrl: string;
    name: string;
    url: string;
  };
  genericMessage: GenericMessage;
  detailsContent: DefinitionList;
  onApprove: () => void;
  onReject: () => void;
  warning?: Warning;
}

export const WalletConnectSignRequest_GenericMessageScreen = ({ route, navigation }: NavigationProps<'WalletConnectSignRequest_GenericMessage'>) => {
  const { accountIdx, metadata, onReject, onApprove, genericMessage, detailsContent, warning } = route.params;
  const { goBack } = navigation;
  const { height } = useWindowDimensions();
  const isCriticalWarning = warning?.severity === 'critical';
  const blockScreenMessage = isCriticalWarning ? warning.message : '';
  const [showBlockScreen, setShowBlockScreen] = useState(isCriticalWarning);
  const handleApprove = useCallback(() => {
    onApprove();
    goBack();
  }, [goBack, onApprove]);
  const handleReject = useCallback(() => {
    onReject();
    goBack();
  }, [goBack, onReject]);
  const [hasScrolledToEndOfContent, setHasScrolledToEndOfContent] = useState(false);

  const renderPreview = useCallback(() => {
    return (
      <View>
        <Header url={metadata.url} icon={metadata.imageUrl} name={metadata.name} heading={getMessageHeading(genericMessage.heading)} />
        <View style={[styles.contentContainer, { maxHeight: height * 0.3 }]}>
          {warning && <CardWarningFromWarning warning={warning} />}
          <GenericSignContent content={genericMessage.message} setHasScrolledToEndOfContent={setHasScrolledToEndOfContent} />
        </View>
      </View>
    );
  }, [genericMessage.heading, genericMessage.message, height, metadata.imageUrl, metadata.name, metadata.url, warning]);

  const renderDetails = useCallback(() => {
    return <ExpandedDetailsContent content={detailsContent} />;
  }, [detailsContent]);

  const renderFooter = () => {
    return (
      <ConfirmationFooter
        content={
          <View style={styles.infoContainer}>
            <Info cells={[<AccountName accountIdx={accountIdx} key={`accountName_${accountIdx}}`} />]} />
          </View>
        }
        disableConfirmationButton={!hasScrolledToEndOfContent}
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
      title={loc.onChainSecurity.messageFlagged}
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
    marginTop: 12,
    gap: 12,
  },
  infoContainer: {
    marginHorizontal: 24,
  },
});

WalletConnectSignRequest_GenericMessageScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
