import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { SectionListData, StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { BottomSheet } from '@/components/BottomSheet';
import { GradientScreenView } from '@/components/Gradients';
import { HeaderNavigationTitle } from '@/components/HeaderNavigationTitle';
import { LargeHeader } from '@/components/LargeHeader';
import { ListHeader } from '@/components/ListHeader';
import navigationStyle from '@/components/navigationStyle';
import { useDefaultSnapPoints } from '@/hooks/useDefaultSnapPoints';
import { parseDefiNetworkTypeToWalletType } from '@/onChain/wallets/registry';
import { RealmDefiPosition, useDefiById } from '@/realm/defi';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { NavigationProps } from '@/Routes';

import { DefiDetailsRow } from './components/DefiDetailsRow';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { prettifyFiatValue } from '/modules/text-utils';

export interface DefiDetailsRouteParams {
  defiId: string;
}

type Section = SectionListData<RealmDefiPosition, { key: string }>;

export const DefiDetailsScreen = ({ route, navigation }: NavigationProps<'DefiDetails'>) => {
  const { defiId } = route.params;
  const defi = useDefiById(defiId);

  useEffect(() => {
    if (!defi) {
      handleError("Internal error: can't find this defi", 'ERROR_CONTEXT_PLACEHOLDER');
      navigation.goBack();
      return;
    }
  }, [navigation, defi]);

  const headerTitleComponent = useCallback(() => {
    if (!defi) {
      return null;
    }
    return (
      <HeaderNavigationTitle
        coinType={parseDefiNetworkTypeToWalletType(defi.network)}
        maskedElementUrl={defi.protocolImageUrl}
        title={defi.protocolName}
        subtitle={`${capitalize(defi.network)} ${loc.defi.network}`}
      />
    );
  }, [defi]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitleComponent,
    });
  }, [headerTitleComponent, navigation]);

  const renderItemSeparator = useCallback(() => <View style={styles.divider} />, []);

  const renderSectionSeparator = useCallback(
    (props: { leadingItem: unknown }) => <View style={props.leadingItem ? styles.leadingSectionDivider : styles.divider} />,
    [],
  );

  const renderSectionHeader = useCallback(({ section }: { section: SectionListData<RealmDefiPosition, Section> }) => {
    return <ListHeader title={section.key} />;
  }, []);

  const renderSectionItem = useCallback(({ item }: { item: RealmDefiPosition }) => {
    return <DefiDetailsRow item={item} />;
  }, []);

  const sectionListKeyExtractor = useCallback((item: RealmDefiPosition, index: number) => {
    return `${item.category}${index}}`;
  }, []);

  const sectionsData = useMemo(() => {
    return (
      defi?.products.map(product => ({
        data: product.positions,
        key: product.label,
      })) ?? []
    );
  }, [defi?.products]);

  const snapPoints = useDefaultSnapPoints();

  const usdFiatRate = useCurrentUsdFiatRate();
  const protocolBalance = usdFiatRate * defi.protocolUsdBalance;
  const { currencyInfo } = useAppCurrency();

  if (!defi) {
    return null;
  }

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <LargeHeader title={defi.protocolName}>
          <AnimatedNumbers type="headerBalance" value={prettifyFiatValue(protocolBalance)} ticker={currencyInfo.symbol} fontSize={56} glyphSize={41} />
        </LargeHeader>
        <BottomSheet snapPoints={snapPoints} index={0} dismissible={false} noSafeInsetTop noBackdrop>
          <BottomSheetSectionList
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustContentInsets
            renderItem={renderSectionItem}
            keyExtractor={sectionListKeyExtractor}
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={renderItemSeparator}
            SectionSeparatorComponent={renderSectionSeparator}
            initialNumToRender={20}
            sections={sectionsData}
            contentContainerStyle={styles.sheetContainer}
            stickySectionHeadersEnabled={false}
          />
        </BottomSheet>
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    height: 20,
  },
  leadingSectionDivider: {
    height: 50,
  },
  sheetContainer: {
    padding: 24,
    paddingTop: 8,
  },
});

DefiDetailsScreen.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  title: '',
  headerTransparent: true,
});
