import React, { useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextLayoutEventData, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label, Typography } from '@/components/Label';
import { IconName, SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { stripHtmlTags } from '@/utils/stripHtmlTags';

import loc from '/loc';

interface Props {
  description: string;
  assetSymbol: string;
}

const INITIAL_NUMBER_OF_LINES = 0;
const NUMBER_OF_LINES_DEFAULT = 4;
const ROW_HEIGHT = Typography.regularBody.lineHeight;

export const AboutAsset = ({ description, assetSymbol }: Props) => {
  const [numberOfLines, setNumberOfLines] = useState(INITIAL_NUMBER_OF_LINES);
  const [measuredNumberOfLines, setMeasuredNumberOfLines] = useState<number>();
  const opacity = useSharedValue(0);

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!measuredNumberOfLines) {
      setMeasuredNumberOfLines(event.nativeEvent.lines.length);
      setNumberOfLines(NUMBER_OF_LINES_DEFAULT);
      opacity.value = withTiming(1, {
        duration: 500, 
      });
    }
  };

  const toggle = () => {
    setNumberOfLines(numberOfLines === NUMBER_OF_LINES_DEFAULT && measuredNumberOfLines ? measuredNumberOfLines : NUMBER_OF_LINES_DEFAULT);
  };

  const hasMore = (measuredNumberOfLines || 0) > NUMBER_OF_LINES_DEFAULT;
  const isExpanded = numberOfLines > NUMBER_OF_LINES_DEFAULT;

  const label = isExpanded ? loc.marketData.showLess : loc.marketData.readMore;
  const icon: IconName = isExpanded ? 'chevron-up' : 'chevron-down';
  const height = useDerivedValue(() =>
    withTiming(numberOfLines * ROW_HEIGHT, {
      duration: opacity.value * 200,
      easing: Easing.in(Easing.linear),
    }),
  );
  const style = useAnimatedStyle(() => ({
    height: height.value ? height.value : undefined,
    opacity: opacity.value,
  }));

  const shadowNodeStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
  }));
  const descriptionWithoutHtml = stripHtmlTags(description);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="AboutAsset">
      <Label type="boldTitle2" style={styles.header}>
        {loc.formatString(loc.marketData.about, { assetSymbol })}
      </Label>
      <View>
        <Label
          style={[!measuredNumberOfLines && styles.absolutePosition, style]}
          type="regularBody"
          color="light50"
          numberOfLines={numberOfLines}
          onTextLayout={onTextLayout}>
          {descriptionWithoutHtml}
        </Label>
        <Label
          style={[!!measuredNumberOfLines && styles.absolutePosition, shadowNodeStyle]}
          type="regularBody"
          color="light50"
          numberOfLines={NUMBER_OF_LINES_DEFAULT + 1}>
          {descriptionWithoutHtml}
        </Label>

        {hasMore && (
          <Touchable style={styles.readMore} onPress={toggle} testID="ReadMore">
            <Label type="boldBody" color="light50" style={styles.readMoreLabel}>
              {label}
            </Label>
            <SvgIcon name={icon} color="light50" size={20} />
          </Touchable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreLabel: {
    lineHeight: 20,
    marginRight: 4,
  },
  absolutePosition: {
    position: 'absolute',
  },
});
