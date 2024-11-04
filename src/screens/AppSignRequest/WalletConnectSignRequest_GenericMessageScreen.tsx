import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BlockScreenSheet } from '@/components/BlockScreen';
import { CardWarningFromWarning } from '@/components/CardWarning';
import { ExpandableSheet } from '@/components/Sheets';
import type { NavigationProps } from '@/Routes';
import type { Warning } from '@/types';
import { navigationStyle } from '@/utils/navigationStyle';

import { AccountName } from './components/AccountName';
import { ConfirmationFooter } from './components/ConfirmationFooter';
import { ExpandedDetailsContent } from './components/ExpandedDetailsContent';
import { GenericSignContent } from './components/GenericSignContent';
import { Header, getMessageHeading } from './components/Header';
import { Info } from './components/Info';

import loc from '/loc';

import type { DefinitionList, GenericMessage } from '/modules/wallet-connect/types';

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
  const isCriticalWarning = warning?.severity === 'critical';
  const blockScreenMessage = isCriticalWarning ? warning.message : '';
  const [showBlockScreen, setShowBlockScreen] = useState(isCriticalWarning);
  const [hasScrolledToEndOfContent, setHasScrolledToEndOfContent] = useState(false);

  const { goBack } = navigation;

  const handleApprove = () => {
    onApprove();
    goBack();
  };

  const handleReject = () => {
    onReject();
    goBack();
  };

  if (showBlockScreen) {
    return (
      <BlockScreenSheet
        onGoBack={handleReject}
        onProceed={() => setShowBlockScreen(false)}
        title={loc.onChainSecurity.messageFlagged}
        message={blockScreenMessage}
      />
    );
  }

  return (
    <ExpandableSheet
      dismissible
      onDismiss={handleReject}
      PreviewComponent={
        <Preview metadata={metadata} warning={warning} genericMessage={genericMessage} setHasScrolledToEndOfContent={setHasScrolledToEndOfContent} />
      }
      DetailsComponent={<ExpandedDetailsContent content={detailsContent} />}
      FloatingButtonsComponent={
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
      }
    />
  );
};

interface PreviewProps {
  metadata: {
    imageUrl: string;
    name: string;
    url: string;
  };
  warning?: Warning;
  genericMessage: GenericMessage;
  setHasScrolledToEndOfContent: React.Dispatch<React.SetStateAction<boolean>>;
}

const Preview: React.FC<PreviewProps> = ({ metadata, warning, genericMessage, setHasScrolledToEndOfContent }) => {
  const { height } = useWindowDimensions();

  return (
    <View>
      <Header url={metadata.url} icon={metadata.imageUrl} name={metadata.name} heading={getMessageHeading(genericMessage.heading)} />
      <View style={[styles.contentContainer, { maxHeight: height * 0.3 }]}>
        {warning && <CardWarningFromWarning warning={warning} />}
        <GenericSignContent content={genericMessage.message} setHasScrolledToEndOfContent={setHasScrolledToEndOfContent} />
      </View>
    </View>
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
