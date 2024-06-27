import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';

import navigationStyle from '@/components/navigationStyle';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { NavigationProps } from '@/Routes';

import loc from '/loc';

interface ItemProps {
  title: string;
  details: string;
}
const SectionItem = ({ title, details }: ItemProps) => {
  return (
    <View>
      <Label type="boldBody">
        {`${title} `}
        <Label type="regularBody" color="light75">
          {details}
        </Label>
      </Label>
    </View>
  );
};

export const MarketDataInfoScreen = ({ navigation }: NavigationProps<'MarketDataInfo'>) => {
  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
      <BottomSheetScrollView style={{ marginBottom: insets.bottom }}>
        <ModalNavigationHeader title={loc.marketData.terminology} onClosePress={close} />
        <View style={styles.container}>
          <View style={styles.section}>
            <GradientItemBackground />
            <SectionItem title={loc.marketData.marketCap.title} details={loc.marketData.marketCap.details} />
            <SectionItem title={loc.marketData.circulatingSupply.title} details={loc.marketData.circulatingSupply.details} />
          </View>
          <View style={styles.section}>
            <GradientItemBackground />
            <SectionItem title={loc.marketData.fullyDilutedValuation.title} details={loc.marketData.fullyDilutedValuation.details} />
            <SectionItem title={loc.marketData.maxSupply.title} details={loc.marketData.maxSupply.details} />
          </View>
          <View style={styles.section}>
            <GradientItemBackground />
            <SectionItem title={loc.marketData.totalSupply.title} details={loc.marketData.totalSupply.details} />
            <SectionItem title={loc.marketData.volume24h.title} details={loc.marketData.volume24h.details} />
          </View>
          <View style={styles.section}>
            <GradientItemBackground />
            <SectionItem title={loc.marketData.allTimeLow.title} details={loc.marketData.allTimeLow.details} />
            <SectionItem title={loc.marketData.allTimeHigh.title} details={loc.marketData.allTimeHigh.details} />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  section: {
    overflow: 'hidden',
    padding: 16,
    gap: 8,
    marginBottom: 1,
  },
});

MarketDataInfoScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: true,
  headerShown: false,
  headerTransparent: true,
  headerLeft: undefined,
  title: '',
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
