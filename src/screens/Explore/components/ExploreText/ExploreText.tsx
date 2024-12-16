import type React from 'react';

import { View } from 'react-native';

import { Label } from '@/components/Label';

import type { ExploreTextProps } from './ExploreText.types';

export const ExploreText: React.FC<ExploreTextProps> = ({
  title,
  body,
  style,
  titleType,
  titleColor,
  titleStyle,
  titleLines,
  bodyType,
  bodyColor,
  bodyStyle,
  bodyLines,
}: ExploreTextProps) => {
  return (
    (title || body) && (
      <View style={style}>
        {title && (
          <Label type={titleType || 'boldTitle1'} color={titleColor || 'light100'} style={titleStyle} numberOfLines={titleLines}>
            {title}
          </Label>
        )}
        {body && (
          <Label type={bodyType || 'regularBody'} color={bodyColor || 'light75'} style={bodyStyle} numberOfLines={bodyLines}>
            {body}
          </Label>
        )}
      </View>
    )
  );
};
