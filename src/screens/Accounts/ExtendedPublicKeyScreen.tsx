import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { AddressDisplay } from '@/components/AddressDisplay';
import { BottomSheet } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { showToast } from '@/components/Toast';
import { TokenIcon } from '@/components/TokenIcon';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { ExtendedPublicKeyQRCode } from './components/ExtendedPublicKeyQRCode';

import loc from '/loc';

export type ExtendedPublicKeyParams = {
  xpub: string;
};

const WALLET_TYPE = 'HDsegwitBech32';

export const ExtendedPublicKeyScreen = ({ route, navigation }: NavigationProps<'ExtendedPublicKey'>) => {
  const { xpub } = route.params;
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const sheetIndex = useSharedValue(0);

  const copyXpub = () => {
    if (xpub) {
      Clipboard.setString(xpub);
      showToast({
        type: 'success',
        text: loc.advancedAccountInfo.xpubCopied,
      });
    }
  };
  const { width } = useSafeAreaFrame();
  const qrCodeSize = width - 96;

  return (
    <BottomSheet dismissible={useIsFocused()} animatedIndex={sheetIndex} snapPoints={['100%']} {...bottomSheetProps}>
      <ModalNavigationHeader onClosePress={close} title={<Header />} />
      <BottomSheetScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Label type="regularBody" color="light75">
            {loc.formatString(loc.extendedPublicKey.summary, {
              summaryEmphasis: <Label color="light75">{loc.extendedPublicKey.summaryEmphasis}</Label>,
            })}
          </Label>
          <Label type="regularBody" color="light75">
            {loc.formatString(loc.extendedPublicKey.type, { type: <Label>{WALLET_TYPE}</Label> })}
          </Label>

          <ExtendedPublicKeyQRCode value={xpub} size={qrCodeSize} />
          <AddressDisplay address={xpub} boldPrefix hasSpaces anyNumberOfLines />
        </View>
      </BottomSheetScrollView>
      <FloatingBottomButtons primary={{ text: loc.extendedPublicKey.copyXpub, onPress: copyXpub }} />
    </BottomSheet>
  );
};

const Header = () => {
  return (
    <View style={styles.header}>
      <TokenIcon size={40} tokenSymbol="btc" forceOmitNetworkIcon />
      <Label type="boldBody" color="light100">
        {loc.extendedPublicKey.bitcoinXpub}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    paddingHorizontal: 24,
    position: 'relative',
  },
  container: {
    gap: 12,
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
});

ExtendedPublicKeyScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
