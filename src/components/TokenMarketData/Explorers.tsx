import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { IconName, SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { AssetExplorer } from '@/realm/assetMetadata';

import loc from '/loc';

interface Props {
  explorers: AssetExplorer[];
}

const VISIBLE_EXPLORERS_COUNT = 2;

export const getExplorerIcon = (label: string): IconName => {
  const lowerCaseLabel = label.toLowerCase();
  if (label === '3pxl') {
    return 'threexpl';
  }
  const labelsWithSameIconNames: IconName[] = [
    'mempool',
    'etherscan',
    'ethplorer',
    'polygonscan',
    'dexguru',
    'arbiscan',
    'basescan',
    'blockscout',
    'solscan',
    'solanafm',
  ];

  if (labelsWithSameIconNames.includes(lowerCaseLabel as IconName)) {
    return lowerCaseLabel as IconName;
  }

  return 'placeholder-explorer';
};

const openUrl = (url: string) => {
  Linking.openURL(url);
};

export const Explorers = ({ explorers }: Props) => {
  if (explorers.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="ExplorersSection">
      <Label type="boldTitle2" style={styles.header}>
        {loc.marketData.explorers}
      </Label>
      <View style={styles.explorers}>
        {explorers.slice(0, VISIBLE_EXPLORERS_COUNT).map(explorer => (
          <Touchable key={explorer.name} style={styles.item} onPress={() => openUrl(explorer.url)} testID={`Explorer-${explorer.name}`}>
            <GradientItemBackground />
            <SvgIcon name={getExplorerIcon(explorer.name)} size={24} bgColor="transparent" color="light75" />
            <Label type="boldBody" color="light75" style={styles.label}>
              {explorer.name}
            </Label>
          </Touchable>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  explorers: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    borderRadius: 12,
    height: 42,
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 12,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    marginLeft: 4,
  },
});
