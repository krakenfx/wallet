import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { SvgIcon } from '@/components/SvgIcon';
import type { NavigationProps } from '@/Routes';

import { useTheme } from '@/theme/themes';
import { navigationStyle } from '@/utils/navigationStyle';

import {
  ExplainerBackupRecoverability,
  ExplainerBlacklisted,
  ExplainerDomainMatch,
  ExplainerDomainMismatch,
  ExplainerEthereumAddress,
  ExplainerEthereumDerivationPath,
  ExplainerKnownSecurityRisk,
  ExplainerTokenContract,
  ExplainerTokenLists,
  ExplainerUnverifiedLists,
  ExplainerWhitelistedKraken,
} from './components/Explainer';

export enum EXPLAINER_CONTENT_TYPES {
  BLACKLISTED = 'blacklisted',
  DOMAIN_MATCH = 'domain_match',
  DOMAIN_MISMATCH = 'domain_mismatch',
  ETHEREUM_ADDRESS = 'ethereum_address',
  ETHEREUM_DERIVATION_PATH = 'ethereum_derivation_path',
  KNOWN_SECURTIY_RISK = 'known_security_risk',
  TOKEN_LISTS = 'token-lists',
  WHITELISTED_KRAKEN = 'whitelisted-kraken',
  UNVERIFIED_LISTS = 'unverified-lists',
  CONTRACT_ADDRESS = 'contract-address',
  BACKUP_RECOVERABILITY = 'backup-recoverability',
}

export type ExplainerModalProps = {
  contentType: EXPLAINER_CONTENT_TYPES;
};

export const ExplainerScreen = ({ navigation, route }: NavigationProps<'Explainer'>) => {
  const theme = useTheme();
  const { contentType } = route.params;
  const insets = useSafeAreaInsets();

  const content = useMemo(() => {
    switch (contentType) {
      case EXPLAINER_CONTENT_TYPES.TOKEN_LISTS:
        return <ExplainerTokenLists />;
      case EXPLAINER_CONTENT_TYPES.WHITELISTED_KRAKEN:
        return <ExplainerWhitelistedKraken />;
      case EXPLAINER_CONTENT_TYPES.BLACKLISTED:
        return <ExplainerBlacklisted />;
      case EXPLAINER_CONTENT_TYPES.ETHEREUM_ADDRESS:
        return <ExplainerEthereumAddress />;
      case EXPLAINER_CONTENT_TYPES.DOMAIN_MATCH:
        return <ExplainerDomainMatch />;
      case EXPLAINER_CONTENT_TYPES.DOMAIN_MISMATCH:
        return <ExplainerDomainMismatch />;
      case EXPLAINER_CONTENT_TYPES.KNOWN_SECURTIY_RISK:
        return <ExplainerKnownSecurityRisk />;
      case EXPLAINER_CONTENT_TYPES.ETHEREUM_DERIVATION_PATH:
        return <ExplainerEthereumDerivationPath />;
      case EXPLAINER_CONTENT_TYPES.UNVERIFIED_LISTS:
        return <ExplainerUnverifiedLists />;
      case EXPLAINER_CONTENT_TYPES.CONTRACT_ADDRESS:
        return <ExplainerTokenContract />;
      case EXPLAINER_CONTENT_TYPES.BACKUP_RECOVERABILITY:
        return <ExplainerBackupRecoverability />;
    }
  }, [contentType]);

  return (
    <BottomSheet
      enableDynamicSizing
      animateOnMount={false}
      detached={true}
      bottomInset={insets.bottom + 30}
      dismissible
      onBackdropPress={navigation.goBack}
      onDismiss={navigation.goBack}
      handleStyle={styles.handle}
      style={styles.modal}>
      <BottomSheetScrollView bounces={false} contentContainerStyle={styles.container} testID={`Explainer-${contentType}`}>
        {content}
        <SvgIcon
          testID="CloseExplainer"
          name="close"
          size={32}
          onPress={navigation.goBack}
          style={[styles.closeIcon, { backgroundColor: theme.colors.light15 }]}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

ExplainerScreen.navigationOptions = navigationStyle({
  animationDuration: 2000,
  animation: 'fade',
  headerShown: false,
  presentation: 'containedTransparentModal',
});

const styles = StyleSheet.create({
  modal: {
    borderRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    marginHorizontal: 24,
  },
  handle: {
    display: 'none',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 32,
  },
  closeIcon: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 48,
    marginTop: 28,
  },
});
