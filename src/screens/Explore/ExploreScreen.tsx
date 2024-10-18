import BottomSheetRef from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExploreContentRow } from '@/api/types';
import { useGlobalState } from '@/components/GlobalState';
import { GradientScreenView } from '@/components/Gradients';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useExploreFeed } from '@/reactQuery/hooks/useExploreFeed';
import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import { NavigationProps } from '@/Routes';

import { isInAppBrowserEnabled } from '@/utils/featureFlags';
import { navigationStyle } from '@/utils/navigationStyle';

import { HomeHeaderAccountSwitch } from '../Home/components/HomeHeaderAccountSwitch';
import { HomeHeaderRight } from '../Home/components/HomeHeaderRight';

import { ExploreDisclaimerSheet } from './components/ExploreDisclaimerSheet';
import { ExploreRow } from './components/ExploreRow';
import { ExploreSearchBar } from './components/ExploreSearch';
import { ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton } from './components/ExploreSkeleton';
import { ExploreAnimationContextProvider } from './context/ExploreAnimationContext';
import { Sizes } from './ExploreScreen.constants';
import { useExploreScreenUnmountAnimation } from './hooks/useExploreScreenUnmountAnimation';
import { renderExploreContent } from './utils/exploreComponentFactory';

import { isValidExploreContent } from './utils/isValidExploreContent';

const skeletons = [ExploreHeroSkeleton, ExploreListSkeleton, ExploreMediumCardSkeleton, ExploreTextSkeleton];

export const ExploreScreen = ({ navigation }: NavigationProps<'Explore'>) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [contentData, setContentData] = useState<FC[] | ExploreContentRow[]>(skeletons);
  const { isFetched, isSuccess, data = [] } = useExploreFeed();
  const [, setShowNavTabs] = useGlobalState('showNavTabs');
  const paddingBottom = useBottomElementSpacing();
  const sheetRef = useRef<BottomSheetRef>(null);
  const hasAcceptedWarning = !!useSettingsByKey(RealmSettingsKey.hasAcceptedExploreWarning);
  const { setHasAcceptedExploreWarning } = useSettingsMutations();

  const onDisclaimerContinue = () => {
    sheetRef?.current?.close();
    setShowNavTabs(true);
  };
  const onDisclaimerDismiss = () => {
    if (hasAcceptedWarning) {
      return;
    }
    setShowNavTabs(true);
    navigation.goBack();
  };
  const onDisclaimerClose = () => {
    setHasAcceptedExploreWarning(true);
    setShowNavTabs(true);
  };
  const onDisclaimerMount = () => {
    setShowNavTabs(false);
  };
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fadeOut = isFetched ? 0 : 500;
    let contentFadeTimeout: NodeJS.Timeout;
    if (isSuccess && isValidExploreContent(data)) {
      contentFadeTimeout = setTimeout(() => {
        setLoaded(true);
        setContentData(data);
      }, fadeOut);
    }
    return () => {
      clearTimeout(contentFadeTimeout);
    };
  }, [isFetched, isSuccess, data]);

  const { animatedStyle, animateScreenUnmount } = useExploreScreenUnmountAnimation();

  return (
    <ExploreAnimationContextProvider animateScreenUnmount={animateScreenUnmount}>
      <GradientScreenView insetHeaderHeight={false} testID="ExploreScreen">
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingTop: insets.top + Sizes.Space.s4, paddingBottom: paddingBottom }}>
          {isInAppBrowserEnabled() ? (
            <View style={styles.searchBarContainer}>
              <ExploreSearchBar />
            </View>
          ) : null}

          {contentData.map((content, index) => {
            const isLast = index === contentData.length - 1;
            const SkeletonComponent = skeletons[index % skeletons.length];
            const delay = Math.min(index * 100, 1000);

            let key = `skeleton_${index}`;
            let rowChildren: React.ReactNode = <SkeletonComponent />;

            if (loaded) {
              const row = content as ExploreContentRow;
              key = `${row.id}_${index}`;
              rowChildren = renderExploreContent(row);
            }

            return (
              <Animated.View key={key} style={animatedStyle}>
                <ExploreRow isLast={isLast} delay={delay}>
                  {rowChildren}
                </ExploreRow>
              </Animated.View>
            );
          })}
        </ScrollView>
        {!hasAcceptedWarning && (
          <ExploreDisclaimerSheet
            ref={sheetRef}
            onContinue={onDisclaimerContinue}
            onDismiss={onDisclaimerDismiss}
            onClose={onDisclaimerClose}
            onMount={onDisclaimerMount}
          />
        )}        
      </GradientScreenView>
    </ExploreAnimationContextProvider>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: Sizes.Space.s2,
  },
});

ExploreScreen.navigationOptions = navigationStyle({
  headerTransparent: true,
  headerTitle: () => '',
  headerRight: () => <HomeHeaderRight />,
  headerLeft: () => <HomeHeaderAccountSwitch />,
});
