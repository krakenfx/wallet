import { useCallback, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CoinHeaderSimple } from '@/components/CoinHeader';
import type { Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { networkIdToNetworkName } from '@/onChain/wallets/registry';
import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { DefiDetailsHeaderBalance, DefiDetailsHeaderRight } from './components/DefiDetailsHeader';
import { DefiDetailsInfoComposition, DefiDetailsInfoPool } from './components/DefiDetailsInfo';

import loc from '/loc';

export interface DefiDetailsSparseRouteParams {
  position: Position;
  protocolName: string;
  protocolIcon: string;
}

const COINS_TO_SHOW_LEFT_HEADER = 10;

export const DefiDetailsSparseScreen = ({ navigation, route }: NavigationProps<'DefiDetailsSparse'>) => {
  const { position, protocolIcon, protocolName } = route.params;
  const vaultType = position.isDebt ? loc.earn.debt : loc.earn.liquidityPool;

  const headerLeftComponent = useCallback(() => {
    const coins = position.assets
      .map(asset => {
        return { tokenId: asset.id, tokenSymbol: asset.symbol, tokenNetwork: networkIdToNetworkName[asset.network] ?? 'ethereum' };
      })
      .reverse();
    const hasOneAsset = position.assets.length === 1;
    const title = hasOneAsset ? (position.assets[0]?.symbol ?? '') : '';
    const subtitle = hasOneAsset ? (networkIdToNetworkName[position.assets[0]?.network] ?? '') : '';

    return <CoinHeaderSimple coins={coins} title={title} subtitle={subtitle} itemsToShow={COINS_TO_SHOW_LEFT_HEADER} />;
  }, [position.assets]);

  const headerRightComponent = useCallback(() => {
    const restrictWidth = position.assets.length >= COINS_TO_SHOW_LEFT_HEADER;

    return <DefiDetailsHeaderRight protocolLogo={protocolIcon} protocolName={protocolName} vaultType={vaultType} restrictWidth={restrictWidth} />;
  }, [position.assets.length, protocolIcon, protocolName, vaultType]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerLeftComponent,
      headerRight: headerRightComponent,
    });
  }, [headerLeftComponent, headerRightComponent, navigation]);

  return (
    <GradientScreenView testID="DefiDetailsScreen">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <DefiDetailsHeaderBalance position={position} />
        </View>
        <View style={styles.compositionContainer}>
          <Label type="boldTitle2">{loc.earn.detailsSheet.info.pool}</Label>
          <DefiDetailsInfoPool protocolLogo={protocolIcon} protocolName={protocolName} position={position} />
        </View>
        <View style={styles.compositionContainer}>
          <Label type="boldTitle2">{loc.earn.detailsSheet.info.composition}</Label>
          <View style={styles.compositionItemsContainer}>
            <DefiDetailsInfoComposition position={position} />
          </View>
        </View>
      </ScrollView>
    </GradientScreenView>
  );
};

DefiDetailsSparseScreen.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTitle: '',
  headerTransparent: true,
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    gap: 32,
  },
  headerContainer: {
    marginBottom: 24,
  },
  compositionContainer: {
    gap: 12,
  },
  compositionItemsContainer: {
    gap: 12,
    borderRadius: 16,
  },
});
