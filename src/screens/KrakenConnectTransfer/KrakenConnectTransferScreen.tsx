import { ScrollView, StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { useKrakenAssetsWithPrices } from '@/reactQuery/hooks/krakenConnect/useKrakenAssetsWithPrices';
import { AssetsToTransfer } from '@/screens/KrakenConnectTransfer/components/AssetsToTransfer';
import { NotSupportedAssets } from '@/screens/KrakenConnectTransfer/components/NotSupportedAssets';
import { navigationStyle } from '@/utils/navigationStyle';

import { ExchangeBalance } from './components/ExchangeBalance';

import loc from '/loc';

export const KrakenConnectTransferScreen = () => {
  const { data } = useKrakenAssetsWithPrices();

  if (!data) {
    return null;
  }

  return (
    <GradientScreenView>
      <ScrollView style={styles.container}>
        <ExchangeBalance />
        <AssetsToTransfer supportedAssets={data.filter(asset => asset.isSupported)} />
        <NotSupportedAssets assets={data.filter(asset => !asset.isSupported)} />
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flex: 1,
  },
});

KrakenConnectTransferScreen.navigationOptions = navigationStyle({ title: loc.krakenConnect.transfer.title, headerTransparent: true });
