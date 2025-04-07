import type { SectionListData, SectionListRenderItem } from 'react-native';

import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { KrakenConnectReceiveCTA } from '@/components/KrakenConnectReceiveCTA/KrakenConnectReceiveCTA';
import { Label } from '@/components/Label';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmToken } from '@/realm/tokens';
import { useTokens } from '@/realm/tokens';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { tokenItemKeyExtractor } from '@/utils/tokenItemKeyExtractor';

import { EXPLAINER_CONTENT_TYPES } from '../Explainer';

import { ReceiveTokenRow } from './components/ReceiveTokenRow';

import loc from '/loc';

type Section =
  | {
      key: 'crypto_and_nft';
      label: string;
      data: RealmResults<RealmToken>;
    }
  | {
      key: 'crypto';
      label: string;
      data: RealmResults<RealmToken>;
    };

type SectionType = SectionListData<RealmToken, Section>;

export const UniversalReceiveScreen = ({ navigation }: NavigationProps<'UniversalReceive'>) => {
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const tokens = useTokens();
  const sections: SectionType[] = useMemo(() => {
    return [
      {
        key: 'crypto_and_nft',
        label: loc.universalReceive.cryptoAndNft,
        data: tokens.filtered('assetId IN $0', [ChainAgnostic.COIN_ETHEREUM, ChainAgnostic.COIN_SOLANA]),
      },
      {
        key: 'crypto',
        label: loc.universalReceive.crypto,
        data: tokens.filtered('assetId IN $0', [ChainAgnostic.COIN_BITCOIN, ChainAgnostic.COIN_DOGECOIN]),
      },
    ];
  }, [tokens]);

  const openReceiveScreen = useCallback((tokenId: string) => navigation.navigate(Routes.Receive, { assetBalanceId: tokenId }), [navigation]);

  const showEthereumExplainer = useCallback(
    () => navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.ETHEREUM_ADDRESS }),
    [navigation],
  );

  const renderSectionItem: SectionListRenderItem<RealmToken, Section> = useCallback(
    ({ item, index, section: { key, data } }) => {
      const lastKey = sections[sections.length - 1].key;
      const rowContent = <ReceiveTokenRow token={item} onQRcodePress={openReceiveScreen} showEthereumExplainer={showEthereumExplainer} />;

      if (key === lastKey && index === data.length - 1) {
        return (
          <View>
            {rowContent}
            <View style={styles.krakenConnect}>
              <KrakenConnectReceiveCTA />
            </View>
          </View>
        );
      }
      return rowContent;
    },
    [openReceiveScreen, showEthereumExplainer, sections],
  );

  const renderHeader = useCallback(
    ({ section }: { section: SectionListData<RealmToken, Section> }) => (
      <Label type="boldTitle2" color="light50">
        {section.label}
      </Label>
    ),
    [],
  );

  const renderListHeader = useCallback(
    () => (
      <Label type="boldDisplay4" style={styles.listHeader}>
        {loc.universalReceive.buttonTitle}
      </Label>
    ),
    [],
  );

  const paddingBottom = useBottomElementSpacing();

  return (
    <BottomSheet enableDynamicSizing {...bottomSheetProps}>
      <BottomSheetSectionList
        testID="UniversalReceiveNetworkList"
        sections={sections}
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={renderSectionItem}
        keyExtractor={tokenItemKeyExtractor}
        ListHeaderComponent={renderListHeader}
        renderSectionHeader={renderHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[{ paddingBottom }]}
        automaticallyAdjustContentInsets
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
  },
  listHeader: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  divider: {
    height: 6,
  },
  krakenConnect: {
    marginBottom: 32,
    marginTop: 16,
  },
});

UniversalReceiveScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
