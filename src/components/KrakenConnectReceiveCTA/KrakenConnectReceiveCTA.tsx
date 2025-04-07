import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { GradientPromoBackground } from '@/components/Gradients/GradientPromoBackground';
import { KrakenIcon } from '@/components/KrakenIcon';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable/Touchable';
import { useGetKrakenSupportedAsset } from '@/reactQuery/hooks/krakenConnect/useGetKrakenSupportedAsset';
import { useIsConnectedWithExchange } from '@/realm/krakenConnect/useIsConnectedWithExchange';
import type { RealmToken } from '@/realm/tokens';
import { Routes } from '@/Routes';

import loc from '/loc';

type Props = {
  token?: RealmToken | KrakenAssetSupported;
  networkId?: string | null;
};

export const KrakenConnectReceiveCTA = ({ token, networkId }: Props) => {
  const navigation = useNavigation();
  const isConnected = useIsConnectedWithExchange();
  const { krakenAsset } = useGetKrakenSupportedAsset(token?.metadata.symbol);

  const handlePress = () => {
    navigation.goBack();
    if (krakenAsset && networkId) {
      navigation.navigate(Routes.KrakenConnectSendStack, {
        screen: 'KrakenConnectSend',
        params: {
          krakenAsset,
          networkId,
        },
      });
    } else {
      navigation.navigate(isConnected ? Routes.KrakenConnectTransfer : Routes.KrakenConnect);
    }
  };

  if (isConnected && (!krakenAsset || !networkId) && token) {
    return null;
  }
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut.duration(100)}>
      <Touchable onPress={handlePress}>
        <View style={styles.container}>
          <GradientPromoBackground />
          <KrakenIcon size={40} iconSize={24} />
          <View style={styles.textContent}>
            <Label type="boldBody" numberOfLines={1}>
              {loc.krakenConnect.receiveCta.headline}
            </Label>
            {isConnected ? null : (
              <Label type="regularCaption1" style={styles.body} color="light75">
                {loc.krakenConnect.receiveCta.body}
              </Label>
            )}
          </View>
          <SvgIcon style={styles.chevron} name="chevron-right" size={24} />
        </View>
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  textContent: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  body: {
    overflow: 'hidden',
  },
  chevron: {
    marginLeft: 'auto',
  },
  paddingSmall: {
    paddingHorizontal: 8,
  },
});
