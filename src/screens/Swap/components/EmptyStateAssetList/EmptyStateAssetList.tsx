import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import loc from '/loc';

type Props = {
  variant: 'sourceAssetList' | 'targetAssetList';
  hasOtherSwappableAssets?: boolean;
  hasIncompatibleAssets?: boolean;
  hasNetworkFilter?: boolean;
  goBack: () => void;
  clearNetworkFilter?: () => void;
};

export const EmptyStateAssetList = ({ variant, hasOtherSwappableAssets, hasIncompatibleAssets, hasNetworkFilter, goBack, clearNetworkFilter }: Props) => {
  const data = useMemo(() => {
    switch (true) {
      case variant === 'targetAssetList': {
        return {
          title: loc.swap.emptyState.targetAssetEmptyTitle,
          desc: loc.swap.emptyState.targetAssetEmptyDesc,
          image: require('@/assets/images/evmAssets/EVMAssets.png'),
          buttonProps: {
            text: loc.swap.emptyState.okay,
          },
        };
      }
      case hasIncompatibleAssets: {
        return {
          title: loc.swap.emptyState.swappableAssetsEmptyTitle,
          desc: loc.swap.emptyState.swappableAssetsEmptyDesc,
          image: require('@/assets/images/evmAssets/EVMAssets.png'),
          buttonProps: {
            text: loc.swap.emptyState.okay,
          },
        };
      }
      case hasOtherSwappableAssets && hasNetworkFilter: {
        return {
          title: loc.swap.emptyState.swappableAssetsEmptyNetworkTitle,
          desc: loc.swap.emptyState.swappableAssetsEmptyNetworkDesc,
          image: require('@/assets/images/evmAssets/EVMAssets.png'),
          buttonProps: {
            text: loc.swap.emptyState.searchAllNetworks,
            onPress: clearNetworkFilter,
          },
        };
      }
      case hasOtherSwappableAssets && !hasNetworkFilter: {
        return {
          title: loc.swap.emptyState.swappableAssetsEmptyTitle,
          desc: loc.swap.emptyState.swappableAssetsEmptyDesc,
          image: require('@/assets/images/evmAssets/EVMAssets.png'),
          buttonProps: {
            text: loc.swap.emptyState.okay,
          },
        };
      }
      default: {
        return {
          title: loc.swap.emptyState.assetsEmptyTitle,
          desc: loc.swap.emptyState.assetsEmptyDesc,
          image: require('@/assets/images/evmAssets/EVMAssets.png'),
        };
      }
    }
  }, [clearNetworkFilter, hasIncompatibleAssets, hasNetworkFilter, hasOtherSwappableAssets, variant]);

  return (
    <View style={styles.container}>
      <Image source={data.image} />
      <Label style={styles.title} type="boldTitle0">
        {data.title}
      </Label>
      {data.desc && (
        <Label color="light75" type="regularBody" style={styles.description}>
          {data.desc}
        </Label>
      )}
      <Button size="small" text={loc.swap.emptyState.goBack} onPress={goBack} style={styles.button} {...data.buttonProps} />
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
