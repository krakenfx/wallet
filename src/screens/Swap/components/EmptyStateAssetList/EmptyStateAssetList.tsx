import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  variant: 'sourceAssetList' | 'targetAssetList';
  hasUnsupportedAssets?: boolean;
  hasNetworkFilter?: boolean;
  goBack: () => void;
  clearNetworkFilter?: () => void;
};

export const EmptyStateAssetList = ({ variant, hasUnsupportedAssets, hasNetworkFilter, goBack, clearNetworkFilter }: Props) => {
  const data = useMemo(() => {
    if (!hasUnsupportedAssets) {
      return {
        title: loc.swap.emptyState.assetsEmptyTitle,
        desc: loc.swap.emptyState.assetsEmptyDesc,
        image: require('@/assets/images/assetGroup/asset-group.png'),
        imageSize: 280,
      };
    }

    return hasNetworkFilter
      ? {
          title: loc.swap.emptyState.swappableAssetsEmptyNetworkTitle,
          desc: loc.swap.emptyState.swappableAssetsEmptyNetworkDesc,
          image: require('@/assets/images/assetGroup/asset-group.png'),
          imageSize: 190,
          buttonProps: {
            text: loc.swap.emptyState.searchAllNetworks,
            onPress: clearNetworkFilter,
          },
        }
      : {
          title: loc.swap.emptyState.swappableAssetsEmptyTitle,
          desc: loc.swap.emptyState.swappableAssetsEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group.png'),
          imageSize: 220,
        };
  }, [clearNetworkFilter, hasNetworkFilter, hasUnsupportedAssets]);

  return (
    <View style={styles.container}>
      <Image
        source={data.image}
        style={{
          width: data.imageSize,
          height: data.imageSize,
        }}
      />
      <Label style={styles.title} type="boldTitle0">
        {data.title}
      </Label>
      {data.desc && (
        <Label color="light75" type="regularBody" style={styles.description}>
          {data.desc}
        </Label>
      )}
      {variant === 'sourceAssetList' && <Button size="small" text={loc.swap.emptyState.goBack} onPress={goBack} style={styles.button} {...data.buttonProps} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    marginHorizontal: 16,
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginHorizontal: 16,
  },
  button: {
    marginTop: 16,
  },
});
