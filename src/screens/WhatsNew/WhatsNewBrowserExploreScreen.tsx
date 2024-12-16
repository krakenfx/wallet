import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SimpleSlide } from '@/components/AnimatedSlides';
import { BottomSheet } from '@/components/BottomSheet';
import { Label } from '@/components/Label';
import { type NonSmallIconName, SvgIcon } from '@/components/SvgIcon';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import type { NavigationProps } from '@/Routes';

import { useTheme } from '@/theme/themes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import loc from '/loc';

interface listItem {
  icon: NonSmallIconName;
  textKey: string;
}

const listItems: listItem[] = [
  { icon: 'compass', textKey: loc.browserExploreWelcome.part1 },
  { icon: 'search', textKey: loc.browserExploreWelcome.part2 },
  { icon: 'plug-disconnected', textKey: loc.browserExploreWelcome.part3 },
];

export const WhatsNewBrowserExploreScreen = ({ navigation }: NavigationProps<'WhatsNewBrowserExplore'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const { setSettings } = useSettingsMutations();
  const { colors } = useTheme();

  useEffect(() => {
    setSettings(RealmSettingsKey.isBrowserExploreTaskModalCompleted, true);
  }, [setSettings]);

  const handleButtonPress = useCallback(() => {
    close();
  }, [close]);

  return (
    <BottomSheet enablePanDownToClose snapPoints={useCommonSnapPoints('toHeaderTransparent')} {...bottomSheetProps}>
      <View style={styles.constainer}>
        <SimpleSlide
          title={loc.browserExploreWelcome.title}
          typeTitle="boldDisplay3"
          onButtonPress={handleButtonPress}
          buttonText={loc.browserExploreWelcome.buttonText}
          animation={require('@/assets/lottie/browserExploreAnnouncement.json')}
          animationHeight={230}
          contentOffset={20}>
          <Animated.View style={styles.body}>
            <Label style={styles.bodyText} type="regularBody" color="light75" entering={FadeIn.duration(500).delay(500)}>
              {loc.browserExploreWelcome.body}
            </Label>
            {listItems.map((item, index) => {
              const delay = (index + 1) * 250 + 500;
              return (
                <Animated.View key={item.textKey} style={styles.list} entering={FadeIn.duration(500).delay(delay)}>
                  <View style={[styles.icon, { backgroundColor: colors.purple_40 }]}>
                    <SvgIcon name={item.icon} size={20} />
                  </View>
                  <Label style={styles.bodyText} type="regularBody" color="light75">
                    {item.textKey}
                  </Label>
                </Animated.View>
              );
            })}
          </Animated.View>
        </SimpleSlide>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  constainer: { marginTop: -10, flex: 1 },
  body: {
    flex: 1,
    paddingBottom: 120,
  },
  labelContainer: {
    marginTop: 85,
    marginBottom: 16,
  },
  bodyText: {
    marginBottom: 16,
  },
  icon: {
    borderRadius: 100,
    height: 36,
    width: 36,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  list: {
    position: 'relative',
    paddingLeft: 52,
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

WhatsNewBrowserExploreScreen.navigationOptions = navigationOptions;
