import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { TokenIcon } from '@/components/TokenIcon';
import { useTokenByAssetId } from '@/realm/tokens';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';

import { useDefiDetailsContext } from '../DefiDetailsContext';

import { DefiDetailsInfoItem } from './DefiDetailsInfoItem';

import loc from '/loc';

export const DefiDetailsInfoVault = ({ handleSheetPositionChange }: { handleSheetPositionChange: (index: number) => unknown }) => {
  const { assetId, assetSymbol, assetNetwork, protocolLogo, protocolName, vaultName, vaultTokenSymbol, vaultType, vaultAssetsLocked, vaultNumberOfHolders } =
    useDefiDetailsContext();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const wallet = useWalletByAssetId(assetId);
  const token = useTokenByAssetId(assetId.toLowerCase(), wallet.id);

  const goToTransactionsScreen = token?.assetId
    ? () => {
        handleSheetPositionChange(1);
        navigation.navigate(Routes.Transactions, { assetBalanceId: { assetId: token.assetId, walletId: wallet.id } });
      }
    : undefined;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="DefiDetailsVaultInfo">
      <Label style={styles.heading} type="boldTitle2">
        {vaultName}
      </Label>
      <View style={[styles.container, { backgroundColor: colors.dark15 }]}>
        <View style={styles.column}>
          <DefiDetailsInfoItem
            label={loc.earn.detailsSheet.info.protocol}
            value={protocolName}
            prefix={<Image style={[styles.icon, styles.protocolLogo]} source={{ uri: protocolLogo }} />}
            style={styles.capitalize}
          />
          <DefiDetailsInfoItem
            label={loc.earn.detailsSheet.info.tokenEarned}
            value={vaultTokenSymbol}
            prefix={<TokenIcon size={16} tokenId={assetId} tokenSymbol={assetSymbol} forceOmitNetworkIcon />}
            style={styles.uppercase}
            onPress={goToTransactionsScreen}
            testID="DefiTokenEarned"
          />
          <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.assetsLocked} value={vaultAssetsLocked} />
        </View>
        <View style={styles.column}>
          <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.type} value={vaultType} style={styles.capitalize} />
          <DefiDetailsInfoItem
            label={loc.earn.detailsSheet.info.network}
            value={assetNetwork}
            prefix={<NetworkIcon networkName={assetNetwork} size={16} />}
            style={styles.capitalize}
          />
          <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.numberHolders} value={vaultNumberOfHolders} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 12,
    paddingLeft: 16,
    gap: 16,
    borderRadius: 16,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  heading: {
    marginBottom: 16,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  icon: {
    height: 16,
    width: 16,
  },
  protocolLogo: {
    borderRadius: 5,
  },
});
