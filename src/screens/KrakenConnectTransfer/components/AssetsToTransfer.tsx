import { StyleSheet, View } from 'react-native';

import { AssetRow } from '@/components/AssetRow';
import { Label } from '@/components/Label';
import type { KrakenAssetSupported } from '@/reactQuery/hooks/krakenConnect/types';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  supportedAssets: KrakenAssetSupported[];
}

export const AssetsToTransfer = ({ supportedAssets }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <View style={styles.header}>
        <Label type="boldTitle0">{loc.krakenConnect.transfer.selectAsset}</Label>
        <Label type="regularBody" color="light75">
          {loc.krakenConnect.transfer.selectAssetDescription}
        </Label>
      </View>
      {supportedAssets
        .sort((a, b) => Number(b.balanceInUsd) - Number(a.balanceInUsd))
        .map(item => (
          <AssetRow
            key={item.assetId}
            token={item}
            options={{
              walletId: item.walletId,
              showAmountInFiat: true,
              forceOmitNetworkIcon: true,
            }}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 22,
  },
});
