import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { Platform, SectionListData, StyleSheet, View, ViewToken } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssetRow } from '@/components/AssetRow';
import { BottomSheet, BottomSheetRef } from '@/components/BottomSheet';
import { FadingElement } from '@/components/FadingElement';
import { ListAnimatedItem } from '@/components/ListAnimatedItem';
import { ListHeader } from '@/components/ListHeader';
import { NFTCollectionRow } from '@/components/NFTCollectionRow';
import { ReputationTag } from '@/components/Reputation';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { REPUTATION } from '@/hooks/useReputation';
import { RealmDefi, useDefi } from '@/realm/defi';
import { NftsCollection, useNftsArchivedCollection, useNftsCollections } from '@/realm/nfts';
import { useTokenPrices } from '@/realm/tokenPrice';
import { RealmToken, sortTokensByFiatValue, useTokensFilteredByReputationAndNetwork } from '@/realm/tokens';
import { NavigationProps, Routes } from '@/Routes';
import { DefiRow } from '@/screens/DefiDetails/components/DefiRow';
import { isRealmObject } from '@/utils/isRealmObject';

import { useHomeAssetPanelEmitterListener } from './homeAssetPanelEventEmitter';
import { HomeAssetPanelSectionList } from './HomeAssetsSectionList';
import { HomeNFTGallery } from './HomeNFTGallery';

import loc from '/loc';

enum SectionName {
  Collection = 'Collection',
  Assets = 'Assets',
  Defi = 'Defi',
}

type Sections =
  | {
      key: typeof SectionName.Collection;
      index: number;
      data: NftsCollection[];
    }
  | {
      key: typeof SectionName.Assets;
      index: number;
      data: RealmToken[];
    }
  | {
      key: typeof SectionName.Defi;
      index: number;
      data: RealmDefi[];
    };

interface HomeAssetsPanelProps {
  navigation: NavigationProps<'Home'>['navigation'];
}

type SectionItem = RealmToken | NftsCollection | RealmDefi;
type SectionType = SectionListData<SectionItem, Sections>;

const COLLECTIONS_TO_SHOW = 3;
const HEADER_HEIGHT = 28;

const renderSectionSeparator = () => <View style={styles.headerDivider} />;

const renderItemSeparator = () => <View style={styles.divider} />;

const sectionListKeyExtractor = (item: SectionItem, index: number) => {
  if (isRealmObject(item) && !item.isValid()) {
    return 'invalid_' + index;
  }
  return (item as NftsCollection | RealmDefi).id || (item as RealmToken).assetId || String(index);
};

const isIos = Platform.OS === 'ios';

const DISTANCE_TO_RECENT_ACTIVITY = 320;

export const HomeAssetsPanel = ({ navigation }: HomeAssetsPanelProps) => {
  const tokens = useTokensFilteredByReputationAndNetwork([]);
  const tokenPrices = useTokenPrices();
  const nftsCollection = useNftsCollections().slice(0, COLLECTIONS_TO_SHOW);
  const defiDeposits = useDefi();
  const archivedCollection = useNftsArchivedCollection();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const stickyHeaderIndex = useSharedValue(0);

  const tokensDataSource = useMemo(() => {
    return sortTokensByFiatValue(tokens.filtered('inGallery == true'), tokenPrices);
  }, [tokens, tokenPrices]);

  const sections = useMemo(() => {
    const items: SectionListData<SectionItem, Sections>[] = [];

    if (tokensDataSource && tokensDataSource?.length > 0) {
      items.push({ index: 0, key: SectionName.Assets, data: tokensDataSource });
    }

    if ((nftsCollection && Object.keys(nftsCollection)?.length > 0) || archivedCollection.nfts.length > 0) {
      items.push({ index: 1, key: SectionName.Collection, data: nftsCollection });
    }

    if (defiDeposits && defiDeposits.length > 0) {
      items.push({ index: 2, key: SectionName.Defi, data: defiDeposits as unknown as RealmDefi[] });
    }

    return items;
  }, [nftsCollection, tokensDataSource, defiDeposits, archivedCollection]);

  const renderNftRow = useCallback(
    (item: NftsCollection) => (
      <ListAnimatedItem>
        <NFTCollectionRow collection={item} onPress={() => navigation.navigate(Routes.NftCollection, { collectionId: item.id })} />
      </ListAnimatedItem>
    ),
    [navigation],
  );

  const renderTokenRow = useCallback(
    (item: RealmToken) => {
      if (!item.isValid()) {
        return null;
      }

      const options = {
        onPress: () => navigation.navigate(Routes.Transactions, { assetBalanceId: { assetId: item.assetId, walletId: item.walletId } }),
        showAmountInFiat: true,
        tag: <ReputationTag assetId={item.assetId} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />,
        testID: `Asset-${item.assetId}`,
        walletId: item.walletId,
      };

      return (
        <ListAnimatedItem>
          <AssetRow token={item} options={options} />
        </ListAnimatedItem>
      );
    },
    [navigation],
  );

  const renderDefiRow = useCallback(
    (item: RealmDefi) => {
      return (
        <ListAnimatedItem>
          <DefiRow item={item} onPress={() => navigation.navigate(Routes.DefiDetails, { defiId: item.id })} />
        </ListAnimatedItem>
      );
    },
    [navigation],
  );

  const renderSectionItem = useCallback(
    ({ item, section }: { item: SectionItem; index: number; section: SectionType }) => {
      switch (section.key) {
        case SectionName.Collection:
          return renderNftRow(item as NftsCollection);
        case SectionName.Assets:
          return renderTokenRow(item as RealmToken);
        case SectionName.Defi:
          return renderDefiRow(item as RealmDefi);
      }
    },
    [renderDefiRow, renderNftRow, renderTokenRow],
  );

  const renderHeader = useCallback(
    ({ section, sticky }: { section: SectionType; sticky?: boolean }) => {
      const headerStyle = [styles.headerStyle, !sticky && styles.scrollableHeaderStyle];
      switch (section.key) {
        case SectionName.Assets:
          return (
            <ListHeader
              title={loc.home.assets}
              buttonText={loc.home.manage}
              onButtonPress={() => {
                navigation.navigate(Routes.CoinsList);
              }}
              buttonTestID={`ManageCoinsButton${sticky ? '-Sticky' : ''}`}
              style={[headerStyle, !sticky && styles.firstHeader]}
            />
          );
        case SectionName.Collection:
          return (
            <>
              <View>
                <ListHeader
                  title={loc.home.collection}
                  buttonText={loc.home.collection_see_all}
                  buttonTestID={`CollectionViewAll${sticky ? '-Sticky' : ''}`}
                  onButtonPress={() => {
                    navigation.navigate(Routes.Nfts);
                  }}
                  style={headerStyle}
                />
                {!sticky && <HomeNFTGallery />}
              </View>
            </>
          );
        case SectionName.Defi:
          return <ListHeader title={loc.home.deposits} style={headerStyle} />;
        default:
          return null;
      }
    },
    [navigation],
  );

  const stickyHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -stickyHeaderIndex.value * HEADER_HEIGHT }],
  }));

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<ViewToken> }) => {
      const header = info.viewableItems.find(item => item.key === '0');
      if (header && stickyHeaderIndex.value !== header.item.index) {
        stickyHeaderIndex.value = header.item.index;
      }
    },
    [stickyHeaderIndex],
  );

  const defaultSnapPoints = useCommonSnapPoints('toHeaderAndMainContent');
  const { bottom } = useSafeAreaInsets();

  const minBottomSnapPoint = useMemo(() => {
    const higherScreenDistance = defaultSnapPoints.length > 0 ? defaultSnapPoints[0] - DISTANCE_TO_RECENT_ACTIVITY : 0;
    const smallerScreenDistance = (isIos ? 0 : bottom) + 64;
    return Math.max(higherScreenDistance, smallerScreenDistance);
  }, [bottom, defaultSnapPoints]);

  const snapPoints = useMemo(() => [minBottomSnapPoint, ...defaultSnapPoints], [defaultSnapPoints, minBottomSnapPoint]);
  const paddingBottom = useBottomElementSpacing(24);

  const showRecentActivity = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  useHomeAssetPanelEmitterListener(showRecentActivity);

  return (
    <BottomSheet animateOnMount ref={bottomSheetRef} snapPoints={snapPoints} index={1} dismissible={false} noSafeInsetTop noBackdrop>
      <Animated.View style={styles.stickyHeaderContainer}>
        <Animated.View style={stickyHeaderStyle}>
          {sections.map(section => (
            <Fragment key={section.key}>{renderHeader({ section, sticky: true })}</Fragment>
          ))}
        </Animated.View>
      </Animated.View>
      <FadingElement>
        <HomeAssetPanelSectionList
          onViewableItemsChanged={onViewableItemsChanged}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustContentInsets
          renderItem={renderSectionItem}
          keyExtractor={sectionListKeyExtractor}
          renderSectionHeader={renderHeader}
          ItemSeparatorComponent={renderItemSeparator}
          SectionSeparatorComponent={renderSectionSeparator}
          sections={sections}
          contentContainerStyle={[styles.container, { paddingBottom }]}
          stickySectionHeadersEnabled={false}
        />
      </FadingElement>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: -HEADER_HEIGHT - 8,
  },
  headerStyle: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  scrollableHeaderStyle: {
    marginTop: 28,
  },
  divider: {
    height: 6,
  },
  stickyHeaderContainer: {
    overflow: 'hidden',
    height: HEADER_HEIGHT,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  headerDivider: {
    height: 20,
  },
  leadingSectionDivider: {
    height: 48,
  },
  firstHeader: {
    marginTop: 0,
    transform: [{ scale: 0 }],
  },
});
