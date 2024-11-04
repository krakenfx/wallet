import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SimpleSlide } from '@/components/AnimatedSlides';
import { BottomSheet } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import loc from '/loc';

export const WhatsNewLongPressScreen = ({ navigation }: NavigationProps<'WhatsNewLongPress'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { setSettings } = useSettingsMutations();

  useEffect(() => {
    setSettings(RealmSettingsKey.whatsNewIsLongPressCompleted, true);
  }, [setSettings]);

  const handleButtonPress = useCallback(() => {
    close();
  }, [close]);

  return (
    <BottomSheet enablePanDownToClose snapPoints={useCommonSnapPoints('toHeaderTransparent')} {...bottomSheetProps}>
      <SimpleSlide
        title={loc.whatsNew.longPress.title}
        typeTitle="boldTitleMarketDataPercentageLarge"
        onButtonPress={handleButtonPress}
        buttonText={loc.whatsNew.longPress.buttonText}
        animation={require('@/assets/lottie/longPressAnimation.json')}
        animationHeight={230}
        contentOffset={8}>
        <Animated.View style={styles.body}>
          <Label style={styles.part1Text} type="mediumBody" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.longPress.part1}
          </Label>
          <Label type="mediumBody" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.longPress.part2}
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

WhatsNewLongPressScreen.navigationOptions = navigationOptions;
