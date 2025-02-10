import type { NativeScrollEvent } from 'react-native';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadingElement } from '@/components/FadingElement';
import { GradientScreenView } from '@/components/Gradients';
import { FlashListWithRefreshControl } from '@/components/ScrollerWithRefreshControl';
import type { WalletType } from '@/onChain/wallets/registry';
import type { NavigationProps } from '@/Routes';

import { SheetPosition } from '@/screens/Transactions/components/TokenMarketData/utils';
import { SMALL_SHEET_MIN_HEIGHT, defaultSheetPosition } from '@/screens/Transactions/components/TokenMarketDataBottomSheet';
import type { TransactionListItem } from '@/screens/Transactions/utils/useTransactionsDataSource';
import { navigationStyle } from '@/utils/navigationStyle';

import { DefiDetailsBottomSheet } from './components/DefiDetailsBottomSheet';
import { DefiDetailsContextProvider, useDefiDetailsContext } from './components/DefiDetailsContext';
import { DefiDetailsHeader } from './components/DefiDetailsHeader';
import { DefiDetailsHeaderLeft } from './components/DefiDetailsHeaderLeft';
import { DefiDetailsHeaderRight } from './components/DefiDetailsHeaderRight';
import { DefiDetailsOpenDappButton } from './components/DefiDetailsOpenDappButton';
import { DefiDetailsTransactionsEmpty } from './components/DefiDetailsTransactionsEmpty';

import type { FlashList } from '@shopify/flash-list';

export interface DefiDetailsRouteParamsV2 {
  assetAddress: string;
  assetCaipId: string;
  assetName: string;
  assetNetwork: WalletType;
  assetSymbol: string;
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  vaultNetwork: WalletType;
  vaultAddress: string;
}

const DefiDetailsScreenV2 = ({ navigation }: NavigationProps<'DefiDetailsV2'>) => {
  const flashListRef = useRef<FlashList<TransactionListItem>>(null);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>(defaultSheetPosition);

  const dataSource: TransactionListItem[] = [];
  const renderFooter = () => null;
  const renderItem = () => null;
  const keyExtractor = () => '';
  const loadNextPage = () => {};

  const { assetAddress, assetName, assetNetwork, assetSymbol, protocolLogo, protocolName, vaultType } = useDefiDetailsContext();
  const headerLeftComponent = useCallback(
    () => <DefiDetailsHeaderLeft assetAddress={assetAddress} assetName={assetName} assetNetwork={assetNetwork} assetSymbol={assetSymbol} />,
    [assetAddress, assetName, assetNetwork, assetSymbol],
  );
  const headerRightComponent = useCallback(
    () => <DefiDetailsHeaderRight protocolLogo={protocolLogo} protocolName={protocolName} vaultType={vaultType} />,
    [protocolLogo, protocolName, vaultType],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerLeftComponent,
      headerRight: headerRightComponent,
    });
  }, [headerLeftComponent, headerRightComponent, navigation]);

  const insets = useSafeAreaInsets();

  const onSheetPositionChange = (position: SheetPosition) => {
    setSheetPosition(position);
  };
  onSheetPositionChange;

  const onScrollEvent = useCallback(
    (e: NativeScrollEvent) => {
      'worklet';
      if (sheetPosition !== SheetPosition.SMALL) {
        if (e.contentOffset.y > 30) {
          runOnJS(setSheetPosition)(SheetPosition.SMALL);
        }
      }
    },
    [sheetPosition],
  );

  return (
    <GradientScreenView>
      <FadingElement containerStyle={{ marginBottom: insets.bottom + SMALL_SHEET_MIN_HEIGHT }}>
        <FlashListWithRefreshControl
          onRefresh={() => {}}
          ListHeaderComponent={<DefiDetailsHeader />}
          ListEmptyComponent={<DefiDetailsTransactionsEmpty />}
          data={dataSource}
          ref={flashListRef}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          estimatedItemSize={60}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          onScrollEvent={onScrollEvent}
        />
      </FadingElement>
      <DefiDetailsBottomSheet onPositionChange={onSheetPositionChange} positionIndex={sheetPosition} />
      <DefiDetailsOpenDappButton />
    </GradientScreenView>
  );
};

const DefiDetailsScreenV2Wrapper = (props: NavigationProps<'DefiDetailsV2'>) => {
  return (
    <DefiDetailsContextProvider {...props.route.params}>
      <DefiDetailsScreenV2 {...props} />
    </DefiDetailsContextProvider>
  );
};

DefiDetailsScreenV2Wrapper.navigationOptions = navigationStyle({
  headerTitleAlign: 'left',
  headerTitle: '',
  headerTransparent: true,
});

export { DefiDetailsScreenV2Wrapper as DefiDetailsScreenV2 };

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  header: {
    marginTop: 46,
    paddingBottom: 4,
  },
  sectionHeader: {
    marginTop: 16,
  },
  transactionHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
