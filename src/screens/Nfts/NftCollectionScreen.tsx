import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { HeaderNavigationTitle } from '@/components/HeaderNavigationTitle';
import { Label } from '@/components/Label';
import { useNftsCollectionById } from '@/realm/nfts';
import { ARCHIVED_NFT } from '@/realm/nfts/consts';
import { useRealmWalletById } from '@/realm/wallets';
import type { NavigationProps } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { navigationStyle } from '@/utils/navigationStyle';

import { NftList } from './components/NftList';

import loc from '/loc';

export interface NftCollectionParams {
  collectionId: string;
}

export const NftCollectionScreen = ({ navigation, route }: NavigationProps<'NftCollection'>) => {
  const { colors } = useTheme();
  const { collectionId } = route.params;

  const collection = useNftsCollectionById(collectionId);
  const wallet = useRealmWalletById(collection?.walletId);

  const { title, subtitle } = useMemo(() => {
    if (!collection) {
      return {};
    }
    return collection.id === ARCHIVED_NFT
      ? {
          title: loc.nftCollection.archiveCollectionDetailsTitle,
          subtitle: loc.nftCollection.archiveCollectionDetailsSubtitle,
        }
      : {
          title: collection.name || collection.nfts.at(0)?.metadata.name,
        };
  }, [collection]);

  const headerTitleComponent = useCallback(() => {
    if (!collection) {
      return <></>;
    }
    return <HeaderNavigationTitle title={title} subtitle={subtitle} maskedElementUrl={collection.imageUrl} coinType={wallet?.type} />;
  }, [collection, subtitle, title, wallet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitleComponent,
    });
  }, [headerTitleComponent, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!collection?.nfts.length) {
        navigation.goBack();
      }
    }, [collection?.nfts.length, navigation]),
  );

  if (!collection) {
    return null;
  }
  const { nfts } = collection;

  return (
    <GradientScreenView>
      <View style={styles.headingWrapper}>
        <Label type="boldDisplay4">{loc.nftCollection.heading}</Label>
        <View style={[styles.itemsCount, { backgroundColor: colors.light15 }]}>
          <Label adjustsFontSizeToFit>{nfts.length}</Label>
        </View>
      </View>
      <NftList data={nfts} />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  headingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    marginTop: 16,
  },
  itemsCount: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 12,
  },
});

NftCollectionScreen.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTransparent: true,
});
