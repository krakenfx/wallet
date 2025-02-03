import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';

import type { ExploreTextProps } from './ExploreText.types';

export const ExploreText: React.FC<ExploreTextProps> = ({
  title,
  body,
  style,
  titleType,
  titleColor,
  titleStyle,
  titleLines,
  titleIcon,
  bodyType,
  bodyColor,
  bodyStyle,
  bodyLines,
  onPress,
}: ExploreTextProps) => {
  if (!title && !body) {
    return null;
  }

  const content = (
    <>
      {title && (
        <View style={styles.title}>
          <Label type={titleType || 'boldTitle1'} color={titleColor || 'light100'} style={titleStyle} numberOfLines={titleLines}>
            {title}
          </Label>
          {titleIcon}
        </View>
      )}
      {body && (
        <Label type={bodyType || 'regularBody'} color={bodyColor || 'light75'} style={bodyStyle} numberOfLines={bodyLines}>
          {body}
        </Label>
      )}
    </>
  );

  if (onPress) {
    return (
      <Touchable onPress={onPress} style={style}>
        {content}
      </Touchable>
    );
  }

  return <View style={style}>{content}</View>;
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
