import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SimpleSlide } from '@/components/AnimatedSlides';
import { BottomSheet } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import { Routes } from '@/Routes';
import type { NavigationProps } from '@/Routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import loc from '/loc';

export const WhatsNewSwaps = ({ navigation }: NavigationProps<'WhatsNewSwaps'>) => {
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const { setSettings } = useSettingsMutations();

  useEffect(() => {
    setSettings(RealmSettingsKey.isSwapsTaskModalCompleted, true);
  }, [setSettings]);

  const handleButtonPress = useCallback(() => {
    navigation.replace(Routes.Swap);
  }, [navigation]);

  return (
    <BottomSheet enablePanDownToClose snapPoints={useCommonSnapPoints('toHeaderTransparent')} {...bottomSheetProps}>
      <SimpleSlide
        title={loc.whatsNew.swaps.title}
        typeTitle="boldDisplay3"
        onButtonPress={handleButtonPress}
        buttonText={loc.whatsNew.swaps.buttonText}
        animation={require('@/assets/lottie/swapsAnnouncement.json')}
        animationHeight={240}
        contentOffset={-5}>
        <Animated.View style={styles.body}>
          <Label style={styles.text} type="regularTitle2" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.swaps.part1}
          </Label>
          <Label style={styles.text} type="regularTitle2" color="light75" entering={FadeIn.duration(500).delay(500)}>
            {loc.whatsNew.swaps.part2}
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
  text: {
    marginBottom: 16,
    lineHeight: 23,
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

WhatsNewSwaps.navigationOptions = navigationOptions;
