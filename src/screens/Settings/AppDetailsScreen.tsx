import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ConnectAppPermissions } from '@/components/ConnectAppPermissions';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { IconWithCoinIcon } from '@/components/IconWithCoinIcon';
import { Label } from '@/components/Label';
import { showToast } from '@/components/Toast';
import { useBrowser } from '@/hooks/useBrowser';
import { WalletType } from '@/onChain/wallets/registry';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';
import { sanitizeUrl } from '@/utils/stringUtils';

import { ActivityIndicatorView } from './components/ActivityIndicatorView';

import { showAlert } from '/helpers/showAlert';
import loc from '/loc';

export type AppDetailsParams = {
  onDisconnect: (confirmed: boolean) => Promise<void>;
  content: {
    description: string;
    iconUri: string;
    network: WalletType | '';
    name: string;
    url: string;
  };
};

export const AppDetailsScreen = ({ navigation, route }: NavigationProps<'AppDetails'>) => {
  const { content, onDisconnect } = route.params;
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { openURL } = useBrowser();

  const body = isDisconnecting ? (
    <ActivityIndicatorView />
  ) : (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <IconWithCoinIcon
            coinSize={25}
            coinType={content.network !== '' ? content.network : undefined}
            iconUri={content.iconUri}
            maskPositionXYNudge={4}
            maskShape="rounded-square"
            size={92}
            style={styles.headerImage}
          />
          {content.name && (
            <Label style={styles.headerName} type="boldTitle1">
              {content.name}
            </Label>
          )}
          {content.url && (
            <Label color="light75" type="regularCaption1">
              {sanitizeUrl(content.url)}
            </Label>
          )}
        </View>
        <ConnectAppPermissions backgroundColor="light8" />
        {content.url && (
          <>
            <Label type="boldCaption1" color="light75" style={styles.heading}>
              URL
            </Label>
            <Label style={styles.content}>{content.url}</Label>
          </>
        )}

        {content.description && (
          <>
            <Label type="boldCaption1" color="light75" style={styles.heading}>
              Description
            </Label>
            <Label style={styles.content}>{content.description}</Label>
          </>
        )}
      </ScrollView>
      <FloatingBottomButtons
        primary={{
          text: loc.connectedApps.app_details.open,
          onPress: () => openURL(content.url),
        }}
        secondary={{
          text: loc.connectedApps.app_details.disconnect,
          textColor: 'red400',
          onPress: async () => {
            const confirmed = await showAlert(
              `${loc.connectedApps.app_details.disconnect} "${content.name ?? ''}"?`,
              loc.connectedApps.app_details.disconnect_decscription,
              loc.connectedApps.app_details.disconnect,
            );

            if (confirmed) {
              try {
                setIsDisconnecting(true);
                await onDisconnect(confirmed);
                navigation.goBack();
              } catch (err) {
                console.log(`Error disconnecting ${content.name}`, err);
                showToast({ type: 'error', text: `${loc.connectedApps.app_details.error} ${content.name}` });
              } finally {
                setIsDisconnecting(false);
              }
            }
          },
        }}
      />
    </>
  );

  return <GradientScreenView>{body}</GradientScreenView>;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  content: {
    lineHeight: 22,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 24,
  },
  headerName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDesc: {
    marginBottom: 4,
  },
  headerImage: {
    marginBottom: 12,
  },
  heading: {
    marginBottom: 8,
    marginTop: 24,
  },
});

AppDetailsScreen.navigationOptions = navigationStyle({ title: '', headerTransparent: true });
