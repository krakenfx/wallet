import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';
import { TokenIcon, omitNetworkIcons } from '@/components/TokenIcon';
import { Routes } from '@/Routes';

import type { CardData } from './DepositOptionsCarousel.types';

import loc from '/loc';

type Props = CardData;

export const DepositOptionsCarouselCard = ({
  assetAddress,
  assetCaipId,
  assetSymbol,
  assetName,
  assetNetwork,
  protocolDescription,
  protocolLogo,
  protocolName,
  protocolApy,
  vaultAddress,
  vaultNetwork,
}: Props) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(Routes.DefiDetailsV2, {
      assetAddress,
      assetCaipId,
      assetName,
      assetNetwork,
      assetSymbol,
      protocolDescription,
      protocolLogo,
      protocolName,
      vaultNetwork,
      vaultAddress,
    });
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.cardContent}>
        <TokenIcon
          tokenId={assetAddress}
          tokenSymbol={assetSymbol}
          networkName={assetNetwork}
          forceOmitNetworkIcon={omitNetworkIcons[assetAddress] === assetNetwork}
        />
        <View style={styles.labels}>
          <Label type="boldTitle2" style={styles.assetSymbol} adjustsFontSizeToFit numberOfLines={1}>
            {assetSymbol}
          </Label>
          <View style={styles.protocolLogoRow}>
            <Image style={styles.protocolLogo} source={{ uri: protocolLogo }} />
            <Label type="regularCaption1" color="light50" style={styles.protocolName} adjustsFontSizeToFit numberOfLines={1}>
              {protocolName}
            </Label>
          </View>
        </View>
        <Label style={styles.apy} type="boldCaption1" color="green400" boldType="boldTitleEarnPercentage" adjustsFontSizeToFit numberOfLines={1}>
          {`<b>${protocolApy}</b> ${loc.earn.apy}`}
        </Label>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    width: 112,
    gap: 8,
  },
  labels: {
    paddingTop: 4,
    gap: 2,
  },
  assetSymbol: {
    textTransform: 'uppercase',
  },
  protocolName: {
    textTransform: 'capitalize',
  },
  protocolLogo: {
    height: 16,
    width: 16,
    borderRadius: 5,
  },
  protocolLogoRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  apy: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
