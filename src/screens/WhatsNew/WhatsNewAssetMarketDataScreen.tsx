import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SimpleSlide } from '@/components/AnimatedSlides';
import { BottomSheet } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import { useTokenPrices } from '@/realm/tokenPrice';
import { sortTokensByFiatValue, useTokensFilteredByReputationAndNetwork } from '@/realm/tokens';
import { Routes } from '@/Routes';
import type { NavigationProps } from '@/Routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import loc from '/loc';

export const WhatsNewAssetMarketDataScreen = ({ navigation }: NavigationProps<'WhatsNewAssetMarketData'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { setSettings } = useSettingsMutations();
  const tokens = useTokensFilteredByReputationAndNetwork([]);
  const tokenPrices = useTokenPrices();

  const sortedTokens = useMemo(() => {
    return sortTokensByFiatValue(tokens.filtered('inGallery == "autoAdded" OR inGallery == "manuallyAdded"'), tokenPrices);
  }, [tokens, tokenPrices]);

  useEffect(() => {
    setSettings(RealmSettingsKey.whatsNewIsAssetMarketDataCompleted, true);
  }, [setSettings]);

  const handleButtonPress = useCallback(() => {
    if (sortedTokens.length > 0) {
      const token = sortedTokens[0];
      navigation.replace(Routes.Transactions, { assetBalanceId: { assetId: token.assetId, walletId: token.walletId } });
    } else {
      close();
    }
  }, [close, navigation, sortedTokens]);

  return (
    <BottomSheet enablePanDownToClose snapPoints={useCommonSnapPoints('toHeaderTransparent')} {...bottomSheetProps} onDismiss={undefined}>
      <SimpleSlide
        title={loc.whatsNew.assetMarketData.title}
        typeTitle="boldTitleMarketDataPercentageLarge"
        onButtonPress={handleButtonPress}
        buttonText={loc.whatsNew.assetMarketData.buttonText}
        animation={require('@/assets/lottie/assetMarketDataAnimation.json')}
        animationHeight={240}
        contentOffset={-5}>
        <Animated.View style={styles.body}>
          <Label style={styles.part1Text} type="regularTitle2" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.assetMarketData.part1}
          </Label>
          <Label type="regularTitle2" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.assetMarketData.part2}
          </Label>
        </Animated.View>
      </SimpleSlide>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  labelContainer: {
    marginTop: 85,
    marginBottom: 16,
  },
  part1Text: {
    marginBottom: 16,
  },
});

const navigationOptions: NativeStackNavigationOptions = {
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
};

WhatsNewAssetMarketDataScreen.navigationOptions = navigationOptions;
