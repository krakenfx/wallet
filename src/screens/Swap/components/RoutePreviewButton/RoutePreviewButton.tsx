import type React from 'react';

import compact from 'lodash/compact';
import { StyleSheet } from 'react-native';

import type { SwapRouteTXStep } from '@/api/types';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { OverlappingCollection } from '@/components/OverlappingCollection';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

type Props = {
  duration?: string;
  steps: SwapRouteTXStep[];
  onPress: () => void;
};

export const RoutePreviewButton: React.FC<Props> = ({ duration, steps, onPress }) => {
  const { colors } = useTheme();

  const icons = compact(steps.map(step => step.provider.icon))
    .map((url, index) => <ImageSvg key={index} fallbackIconSize={16} width={16} height={16} uri={url} />)
    .reverse();

  return (
    <Touchable onPress={onPress} style={[styles.routePreview, { backgroundColor: colors.purple_20 }]}>
      <OverlappingCollection itemSize={16} maskedItemOffset={5} items={icons} />
      <Label type="boldCaption1">{duration}</Label>
      <SvgIcon size={16} name="info-circle" color="light50" />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  routePreview: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
