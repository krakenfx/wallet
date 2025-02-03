import type { SectionListData, ViewToken } from 'react-native';

import { Fragment, useCallback, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomSheetRef } from '@/components/BottomSheet';
import { BottomSheet } from '@/components/BottomSheet';
import { DefiDiscoveryPreview } from '@/components/DefiDiscoveryPreview';
import { FadingElement } from '@/components/FadingElement';

import { ListAnimatedItem } from '@/components/ListAnimatedItem';
import { ListHeader } from '@/components/ListHeader';
import { NFTCollectionRow } from '@/components/NFTCollectionRow';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import type { RealmDefi } from '@/realm/defi';
import { useDefi } from '@/realm/defi';
import type { NftsCollection } from '@/realm/nfts';
import { useNftsArchivedCollection, useNftsCollections } from '@/realm/nfts';
import { useTokenPrices } from '@/realm/tokenPrice';
import type { RealmToken } from '@/realm/tokens';
import { sortTokensByFiatValue, useTokensFilteredByReputationAndNetwork } from '@/realm/tokens';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { DefiRow } from '@/screens/DefiDetails/components/DefiRow';
import { useFeatureFlag } from '@/unencrypted-realm/featureFlags/useFeatureFlag';
import { isRealmObject } from '@/utils/isRealmObject';

import { useHomeAssetPanelEmitterListener } from './homeAssetPanelEventEmitter';
import { HomeAssetPanelSectionList } from './HomeAssetsSectionList';
import { HomeNFTGallery } from './HomeNFTGallery';
import { KrakenConnectFundCTA } from './KrakenConnectFundCTA';

import { TokenRow } from './TokenRow';

import loc from '/loc';

enum SectionName {
  Collection = 'Collection',
  Assets = 'Assets',
  Defi = 'Defi',
  DefiEarnEnabled = 'DefiEarnEnabled',
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
    }
  | {
      key: typeof SectionName.DefiEarnEnabled;
      index: number;
      data: DefiEarn[];
    };

interface HomeAssetsPanelProps {
  navigation: NavigationProps<'Home'>['navigation'];
}

interface DefiEarn {}
type SectionItem = RealmToken | NftsCollection | RealmDefi | DefiEarn;
type SectionType = SectionListData<SectionItem, Sections>;

const COLLECTIONS_TO_SHOW = 3;
const HEADER_HEIGHT = 28;

const renderSectionSeparator = () => <View style={styles.headerDivider} />;

const renderItemSeparator = () => <View style={styles.divider} />;

const sectionListKeyExtractor = (item: SectionItem, index: number) => {
  if (item === null || (isRealmObject(item) && !item.isValid())) {
    return 'invalid_' + index;
  }
  return (item as NftsCollection | RealmDefi).id || (item as RealmToken).assetId || String(index);
};

const isIos = Platform.OS === 'ios';

const DISTANCE_TO_RECENT_ACTIVITY = 320;

export const HomeAssetsPanel = ({ navigation }: HomeAssetsPanelProps) => {
  const [isEarnEnabled] = useFeatureFlag('earnEnabled');
  const tokens = useTokensFilteredByReputationAndNetwork([]);
  const tokenPrices = useTokenPrices();
  const nftsCollection = useNftsCollections().slice(0, COLLECTIONS_TO_SHOW);
  const defiDeposits = useDefi();
  const archivedCollection = useNftsArchivedCollection();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [krakenConnectEnabled] = useFeatureFlag('krakenConnectEnabled');

  const stickyHeaderIndex = useSharedValue(0);

  const tokensDataSource = useMemo(() => {
    return sortTokensByFiatValue(tokens.filtered('inGallery == "autoAdded" OR inGallery == "manuallyAdded"'), tokenPrices);
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
    } else if (isEarnEnabled) {
      items.push({ index: 2, key: SectionName.DefiEarnEnabled, data: [{}] });
    }

    return items;
  }, [nftsCollection, tokensDataSource, defiDeposits, archivedCollection, isEarnEnabled]);

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

      return (
        <ListAnimatedItem>
          <TokenRow token={item} navigation={navigation} />
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
        case SectionName.DefiEarnEnabled:
          return <DefiDiscoveryPreview caption={loc.home.defiEmptyCaption} />;
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
        case SectionName.DefiEarnEnabled:
          return (
            <Touchable style={styles.defiEmpty}>
              <ListHeader title={loc.home.defiEmpty} />
              <SvgIcon size={24} name="chevron-right" color="light100" />
            </Touchable>
          );
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
  const paddingBottom = useBottomElementSpacing(80);

  const showRecentActivity = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  useHomeAssetPanelEmitterListener(showRecentActivity);

  return (
    <BottomSheet animateOnMount ref={bottomSheetRef} snapPoints={snapPoints} index={1} dismissible={false} noSafeInsetTop noBackdrop>
      {krakenConnectEnabled ? (
        <View style={styles.krakenConnectContainer}>
          <KrakenConnectFundCTA />
        </View>
      ) : null}
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
  krakenConnectContainer: {
    marginHorizontal: 24,
    marginVertical: 4,
  },
  defiEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: HEADER_HEIGHT,
  },
});
