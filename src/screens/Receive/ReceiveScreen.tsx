import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Share from 'react-native-share';

import { ActivityIndicator } from '@/components/ActivityIndicator/ActivityIndicator';
import { AddressDisplay } from '@/components/AddressDisplay';
import { BottomSheet } from '@/components/BottomSheet';
import { CoinHeader } from '@/components/CoinHeader';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useResolvedAssetBalance } from '@/realm/tokens';
import { useRealmWalletById } from '@/realm/wallets';
import { NavigationProps } from '@/Routes';
import { AssetBalanceId } from '@/types';
import { getWalletName } from '@/utils/getWalletName';
import { useIsOnline } from '@/utils/useConnectionManager';

import navigationStyle from '../../components/navigationStyle';

import AddressQRCode from './components/AddressQRCode';
import { useReceiveAddress } from './hooks';

import loc from '/loc';

export type ReceiveRouteProps = {
  assetBalanceId: AssetBalanceId;
};

export const ReceiveScreen = ({ route, navigation }: NavigationProps<'Receive'>) => {
  const params = route.params;
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const sheetIndex = useSharedValue(0);
  const [walletId] = useResolvedAssetBalance(params.assetBalanceId);

  const wallet = useRealmWalletById(walletId!);

  const isOnline = useIsOnline();

  const displayAddressText = useReceiveAddress(wallet, isOnline);

  const { network } = getImplForWallet(wallet);

  const share = () => Share.open({ message: displayAddressText });
  const { width } = useSafeAreaFrame();

  const qrCodeSize = width - 96;

  return (
    <BottomSheet dismissible={useIsFocused()} animatedIndex={sheetIndex} snapPoints={['100%']} {...bottomSheetProps}>
      <ModalNavigationHeader onClosePress={close} title={<CoinHeader assetBalanceId={params.assetBalanceId} />} />
      <BottomSheetScrollView style={styles.scrollView} testID="ReceiveScreen">
        {displayAddressText ? (
          <View style={styles.container}>
            <Label type="regularBody" color="light75" style={styles.warningLabel}>
              {wallet
                ? loc.formatString(network.createNFTTransferTransaction ? loc.receive.warning_nft : loc.receive.warning, {
                    networkName: <Label>{getWalletName(wallet.type)}</Label>,
                  })
                : ''}
            </Label>
            <AddressQRCode value={displayAddressText} style={styles.qrcode} size={qrCodeSize} />
            <AddressDisplay address={displayAddressText} showButton hasSpaces boldPrefix />
          </View>
        ) : undefined}
      </BottomSheetScrollView>
      {!displayAddressText ? (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <ActivityIndicator />
        </View>
      ) : undefined}
      <FloatingBottomButtons primary={{ text: loc.receive.share, onPress: share, testID: 'ShareButton' }} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
    position: 'relative',
  },
  container: {
    alignItems: 'center',
  },
  emptyOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  qrcode: {
    marginVertical: 24,
  },
  warningLabel: {
    textAlign: 'center',
  },
});

ReceiveScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
