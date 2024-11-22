import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useAccountById } from '@/realm/accounts/useAccountById';

import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { BitcoinPanel } from './components/BitcoinPanel';
import { DogePanel } from './components/DogePanel';
import { EvmPanel } from './components/EvmPanel';
import { SolanaPanel } from './components/SolanaPanel';

import loc from '/loc';

export interface AdvancedAccountInfoParams {
  accountNumber: number;
}

export const AdvancedAccountInfoScreen = ({ route, navigation }: NavigationProps<'AdvancedAccountInfo'>) => {
  const account = useAccountById(route.params.accountNumber);
  const headerTitle = loc.formatString(loc.advancedAccountInfo.title, { walletName: account.accountCustomName }).toString();
  useHeaderTitle(headerTitle);
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const paddingBottom = useBottomElementSpacing();
  const derivationPaths = useMemo(() => {
    const derivationPaths: Record<string, string> = {
      HDsegwitBech32: '',
      ethereum: '',
      solana: '',
      dogecoin: '',
    };

    account.wallets.map(wallet => {
      const { network } = getImplForWallet(wallet);

      if (wallet && wallet.type in derivationPaths) {
        const derivationPath = network.getDerivationPath(wallet?.accountIdx);

        derivationPaths[wallet.type] = derivationPath;
      }
    });

    return derivationPaths;
  }, [account.wallets]);

  return (
    <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
      <ModalNavigationHeader title={headerTitle} onClosePress={close} />
      <BottomSheetScrollView contentContainerStyle={[styles.wrapper, { paddingBottom }]}>
        <Label type="boldTitle2" color="light50" style={styles.sectionHeader}>
          {loc.advancedAccountInfo.walletInformation}
        </Label>
        <View style={styles.panelsContainer}>
          <EvmPanel derivationPath={derivationPaths.ethereum} />
          <SolanaPanel derivationPath={derivationPaths.solana} />
          <BitcoinPanel accountNumber={route.params.accountNumber} derivationPath={derivationPaths.HDsegwitBech32} />
          <DogePanel derivationPath={derivationPaths.dogecoin} />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 40,
    marginHorizontal: 12,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 12,
  },
  panelsContainer: {
    gap: 12,
  },
});

AdvancedAccountInfoScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
