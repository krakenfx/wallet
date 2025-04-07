import type React from 'react';

import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Touchable } from '@/components/Touchable';
import { Routes } from '@/Routes';

import { AccordionItem } from '../AccordionItem';

import { DefiProtocolHeading } from './DefiProtocolHeading';
import { DefiProtocolMultipleAssetsPositionRow } from './DefiProtocolMultipleAssetsPositionRow';
import { ANIMATION_DURATION } from './DefiProtocolPositions.constants';

import { DefiProtocolSingleAssetPositionRow } from './DefiProtocolSingleAssetPositionRow';

import type { DefiProtocolPositionsProps, Position } from './DefiProtocolPositions.types';

export const DefiProtocolPositions: React.FC<DefiProtocolPositionsProps> = ({ protocol }) => {
  const { protocolName, protocolIcon, totalValueInUsd, positions } = protocol;

  const isExpanded = useSharedValue(true);

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  const navigation = useNavigation();

  const onPress = useCallback(
    (position: Position) => () => {
      if (position.vaultAddress && position.vaultNetwork) {
        navigation.navigate(Routes.DefiDetails, {
          assetId: position.assets[0]?.id,
          protocolLogo: protocolIcon,
          vaultAddress: position.vaultAddress,
          vaultNetwork: position.vaultNetwork,
        });
      } else {
        navigation.navigate(Routes.DefiDetailsSparse, {
          position,
          protocolName,
          protocolIcon,
        });
      }
    },
    [navigation, protocolName, protocolIcon],
  );

  return (
    <View style={styles.container}>
      <DefiProtocolHeading
        protocolName={protocolName}
        protocolIcon={protocolIcon}
        nOfPositions={positions.length}
        totalValueInUsd={totalValueInUsd}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />

      <AccordionItem style={styles.positionsContainer} isExpanded={isExpanded} duration={ANIMATION_DURATION}>
        <GradientItemBackground style={[StyleSheet.absoluteFill, styles.gradient]} />
        <View style={styles.positionsContent}>
          {positions.map((position, index) => {
            const { id, assets, isDebt, positionUsdValue, apy } = position;

            return (
              <Touchable key={`${id}-${index}`} onPress={onPress(position)} testID="DefiProtocolPosition">
                {assets.length === 1 ? (
                  <DefiProtocolSingleAssetPositionRow asset={assets[0]} isDebt={isDebt} apy={apy} positionUsdValue={positionUsdValue} />
                ) : (
                  <DefiProtocolMultipleAssetsPositionRow assets={assets} isDebt={isDebt} positionUsdValue={positionUsdValue} />
                )}
              </Touchable>
            );
          })}
        </View>
      </AccordionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
  },
  gradient: {
    borderRadius: 16,
  },
  positionsContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
  },
  positionsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 65,
  },
});
