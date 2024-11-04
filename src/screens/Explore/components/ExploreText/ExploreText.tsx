import React from 'react';
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
  bodyType,
  bodyColor,
  bodyStyle,
}: ExploreTextProps) => {
  return (
    (title || body) && (
      <View style={style}>
        {title && (
          <Label type={titleType || 'boldTitle1'} color={titleColor || 'light100'} style={titleStyle}>
            {title}
          </Label>
        )}
        {body && (
          <Label type={bodyType || 'mediumBody'} color={bodyColor || 'light75'} style={bodyStyle}>
            {body}
          </Label>
        )}
      </View>
    )
  );
};
