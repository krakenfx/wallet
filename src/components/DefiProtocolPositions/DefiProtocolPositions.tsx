import type React from 'react';

import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';

import { AccordionItem } from '../AccordionItem';

import { DefiProtocolHeading } from './DefiProtocolHeading';
import { ANIMATION_DURATION } from './DefiProtocolPositions.constants';
import { DefiProtocolPositionsRow } from './DefiProtocolPositionsRow';

import type { DefiProtocolPositionsProps } from './DefiProtocolPositions.types';

export const DefiProtocolPositions: React.FC<DefiProtocolPositionsProps> = ({ protocol }) => {
  const { protocolName, protocolIcon, totalValue, positions } = protocol;

  const isExpanded = useSharedValue(true);

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  return (
    <View style={styles.container}>
      <DefiProtocolHeading
        protocolName={protocolName}
        protocolIcon={protocolIcon}
        nOfPositions={positions.length}
        totalValue={totalValue}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />

      <AccordionItem style={styles.positionsContainer} isExpanded={isExpanded} duration={ANIMATION_DURATION}>
        <GradientItemBackground style={[StyleSheet.absoluteFill, styles.gradient]} />
        <View style={styles.positionsContent}>
          {positions.map(position => (
            <DefiProtocolPositionsRow key={position.id} position={position} />
          ))}
        </View>
      </AccordionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
  },
});
