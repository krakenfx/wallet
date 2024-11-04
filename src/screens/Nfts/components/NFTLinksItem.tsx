import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

type Props = {
  label: string;
  content?: string;
  variant?: 'light' | 'dark';
  isFirst?: boolean;
  isLast?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onPress?: () => void;
  contentImageUrl?: string;
};

export const NFTLinksItem: React.FC<Props> = ({ label, content, variant = 'dark', isFirst, isLast, iconLeft, iconRight, onPress, contentImageUrl }) => {
  const { colors } = useTheme();

  const backgroundColor = variant === 'dark' ? colors.dark25 : undefined;

  return (
    <Touchable
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, { backgroundColor }, isFirst && styles.topElement, isLast && styles.bottomElement]}>
      {variant === 'light' && <GradientItemBackground />}
      <View style={styles.row}>
        {!!iconLeft && <SvgIcon name={iconLeft} style={styles.icon} />}
        <Label type="boldTitle2" numberOfLines={1}>
          {label}
        </Label>
      </View>
      {(!!content || !!contentImageUrl) && (
        <View style={[styles.row, styles.contentContainer]}>
          {!!contentImageUrl && <ImageSvg uri={contentImageUrl} width={24} height={24} style={styles.image} />}
          <Label type="regularBody" numberOfLines={1} ellipsizeMode="middle" style={[{ color: colors.light75 }, styles.content]}>
            {content}
          </Label>
        </View>
      )}
      {!!iconRight && <SvgIcon name={iconRight} />}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    alignItems: 'center',
    marginBottom: 1,
    overflow: 'hidden',
  },
  topElement: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomElement: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  icon: {
    marginRight: 6,
    marginLeft: -2,
  },
  image: {
    borderRadius: 12,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  content: {
    textAlign: 'right',
  },
});
