import { StyleSheet, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { CopyToClipBoard } from '@/components/CopyToClipboard';
import { Label } from '@/components/Label';
import { NetworkIDIcons } from '@/components/NetworkIDIcons';
import { SvgIcon } from '@/components/SvgIcon';
import { TokenIcon } from '@/components/TokenIcon';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmToken } from '@/realm/tokens';
import { FeatureFlag, NEW_EVM_NETWORKS, useFeatureFlagEnabled } from '@/utils/featureFlags';

import { useReceiveAddress } from '../hooks';

import loc from '/loc';

type Props = {
  token: RealmToken;
  onQRcodePress: (assetId: string) => void;
  showEthereumExplainer: () => void;
};

export const ReceiveTokenRow = ({ token, onQRcodePress, showEthereumExplainer }: Props) => {
  const address = useReceiveAddress(token.wallet);
  const isNewNetworksEnabled = useFeatureFlagEnabled(FeatureFlag.NewNetworksEnabled);

  const handleQRIconPress = () => onQRcodePress(token.id);

  const renderEthereumLabel = () => (
    <View style={styles.ethereumLabel}>
      <Label color="light75" type="regularCaption1">
        {loc.universalReceive.ethereumAddressLabel}
      </Label>
      <SvgIcon name="info-circle" size={16} color="light50" style={styles.info} onPress={showEthereumExplainer} />
    </View>
  );

  const isEthereum = token.assetId === ChainAgnostic.COIN_ETHEREUM;

  const networkIDs = [
    ChainAgnostic.NETWORK_ETHEREUM,
    ChainAgnostic.NETWORK_POLYGON,
    ChainAgnostic.NETWORK_ARBITRUM,
    ChainAgnostic.NETWORK_OPTIMISM,
    ChainAgnostic.NETWORK_BASE,
    ChainAgnostic.NETWORK_LINEA,
    ChainAgnostic.NETWORK_AVALANCHE,
    ...(isNewNetworksEnabled ? NEW_EVM_NETWORKS : []),
  ];

  return (
    <CopyToClipBoard
      testID={`ReceiveTokenRow-${token.assetId}`}
      stringToCopy={address}
      toastMessage={loc.universalReceive.copied}
      contentStyle={styles.container}
      containerStyle={styles.copyToClipboard}>
      <TokenIcon wallet={token.wallet} tokenId={token.assetId} tokenSymbol={token.metadata.symbol} />
      <View style={styles.content}>
        <Label type="boldTitle2">{loc.formatString(loc.universalReceive.tokenAddress, { token: token.metadata.label })}</Label>
        {isEthereum && renderEthereumLabel()}
        <View style={styles.addressContainer}>
          {isEthereum && <NetworkIDIcons align="left" containerStyle={styles.networkIcons} networkIDs={networkIDs} />}
          {address && (
            <Label
              testID={`ReceiveAddress-${token.assetId}`}
              entering={FadeIn}
              type="regularCaption1"
              color="light75"
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.address}>
              {address}
            </Label>
          )}
        </View>
      </View>
      <SvgIcon testID={`ShowQRCodeIcon-${token.assetId}`} name="qr-code" onPress={handleQRIconPress} />
    </CopyToClipBoard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyToClipboard: {
    alignItems: 'center',
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  ethereumLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    minHeight: 20,
  },
  address: {
    maxWidth: 100,
  },
  networkIcons: {
    marginRight: 4,
  },
  info: {
    marginLeft: 4,
  },
});
