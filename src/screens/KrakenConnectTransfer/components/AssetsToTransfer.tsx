import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { AssetRow } from '@/components/AssetRow';
import { Label } from '@/components/Label';
import { Routes } from '@/Routes';
import { AssetsSkeletons } from '@/screens/KrakenConnectTransfer/components/AssetsSkeletons';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  supportedAssets: KrakenAssetSupported[];
  isLoading?: boolean;
}

export const AssetsToTransfer = ({ supportedAssets, isLoading }: Props) => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  const onPress = (asset: KrakenAssetSupported) => {
    navigate(Routes.KrakenConnectSendStack, {
      screen: 'KrakenConnectSend',
      params: { krakenAsset: asset },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.light2 }]}>
      <View style={styles.header}>
        <Label type="boldTitle0">{loc.krakenConnect.transfer.selectAsset}</Label>
        <Label type="regularBody" color="light75">
          {loc.krakenConnect.transfer.selectAssetDescription}
        </Label>
      </View>
      {isLoading ? (
        <AssetsSkeletons />
      ) : (
        supportedAssets
          .sort((a, b) => Number(b.balanceInUsd) - Number(a.balanceInUsd))
          .map(item => (
            <AssetRow
              key={item.assetId}
              token={item}
              options={{
                walletId: item.walletId,
                showAmountInFiat: true,
                forceOmitNetworkIcon: true,
                onPress: () => onPress(item),
                disableLongPress: true,
              }}
            />
          ))
      )}
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
