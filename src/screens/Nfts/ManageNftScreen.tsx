import BottomSheetView from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import navigationStyle from '@/components/navigationStyle';
import { NftBlock } from '@/components/NftBlock';
import { showToast } from '@/components/Toast';
import { useNftById, useNftsMutations } from '@/realm/nfts';
import { useNftGalleryToggle } from '@/realm/nfts/useNftGalleryToggle';
import { NavigationProps, Routes } from '@/Routes';
import { ActionButton } from '@/screens/Nfts/components/ActionButton';

import loc from '/loc';

export interface ManageNftParams {
  id: string;
}

export const ManageNftScreen = ({ route, navigation }: NavigationProps<'ManageNft'>) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const sheetRef = useRef<BottomSheetView>(null);

  const params = route.params;

  const { unArchiveNft, toggleNftInArchive } = useNftsMutations();

  const nft = useNftById(params.id);
  const { toggleGallery, isInGallery } = useNftGalleryToggle(nft);

  const handleCTAPress = useCallback(() => {
    if (nft.isArchived) {
      unArchiveNft(nft);
      showToast({ type: 'success', text: loc.nftManage.unArchiveSuccess });
    } else {
      navigation.replace(Routes.SendStack, { screen: 'Send', params: { nftAssetId: nft.assetId } });
    }
  }, [navigation, nft, unArchiveNft]);

  const onArchiveTogglePress = useCallback(() => {
    toggleNftInArchive(nft);
  }, [nft, toggleNftInArchive]);

  const onClosePress = () => {
    sheetRef.current?.close();
    return true;
  };

  if (!nft) {
    return null;
  }

  const onCopy = () => {
    Clipboard.setString(nft.metadata.tokenId);
  };

  return (
    <BottomSheet ref={sheetRef} snapPoints={[height - insets.top]} onDismiss={navigation.goBack} dismissible>
      <ModalNavigationHeader title={loc.nftManage.title} onClosePress={onClosePress} />

      <View style={styles.container}>
        <NftBlock nft={nft} containerStyle={styles.nft} />

        {!nft.isArchived && (
          <ActionButton
            testID="FavoriteButton"
            onPress={toggleGallery}
            iconName={isInGallery ? 'star-filled' : 'star'}
            label={loc.nftManage.favorite}
            disableEffect
          />
        )}
        <ActionButton testID="CopyButton" onPress={onCopy} label={loc.nftManage.copy_id} iconName="copy" />
        <ActionButton
          testID="ArchiveButton"
          onPress={onArchiveTogglePress}
          iconName="archive"
          label={nft.isArchived ? loc.nftManage.unArchive : loc.nftManage.archive}
        />
      </View>
      <FloatingBottomButtons
        primary={{
          text: nft.isArchived ? loc.nftManage.unArchive : loc._.send,
          onPress: handleCTAPress,
        }}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  nft: {
    marginBottom: 24,
  },
});

ManageNftScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  animation: 'none',
  headerShown: false,
});
