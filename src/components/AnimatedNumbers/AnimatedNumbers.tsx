import { clamp } from 'lodash';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, NativeSyntheticEvent, StyleProp, StyleSheet, TextLayoutEventData, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label, LabelProps, TypographyKey } from '@/components/Label';
import { Theme } from '@/theme/themes';

import { Tick } from './Tick';

export type AnimatedNumbersProps = Omit<LabelProps, 'numberOfLines' | 'children' | 'type'> & {
  value: number | string;
  type: 'headerBalance' | 'boldLargeMonospace' | 'boldTitleMarketDataPercentageLarge' | 'boldTitleMarketDataPercentage';
  height?: number;
  fontSize: number;
  
  
  glyphSize: number;
  ticker?: string;
  tickerType?: TypographyKey;
  tickerFontSize?: number;
  tickerBottomOffset?: number; 
  prefix?: string;
  suffix?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  color?: keyof Theme['colors'];
};
export const AnimatedNumbers = React.memo(
  ({
    value,
    ticker,
    prefix,
    suffix,
    type,
    tickerType = 'headerBalanceTicker',
    tickerFontSize = 24,
    tickerBottomOffset = 8,
    fontSize,
    height = fontSize,
    glyphSize,
    testID,
    style,
    color,
    ...containerProps
  }: AnimatedNumbersProps) => {
    const [containerLayout, setContainerLayout] = useState<LayoutRectangle>();
    const [measured, setMeasured] = useState(false);
    const scale = useSharedValue(1);
    const glyphMargin = (fontSize - glyphSize) / 2;
    const lineHeight = fontSize + glyphMargin;

    const handleTextLayout = useCallback(
      ({ nativeEvent: { lines } }: NativeSyntheticEvent<TextLayoutEventData>) => {
        const totalWidth = lines.reduce((acc, line) => line.width + acc, 0);
        if (!containerLayout) {
          
          return;
        }

        const requiredScaleFactor = clamp(containerLayout.width / totalWidth, 0, 1);
        scale.value = withTiming(requiredScaleFactor, { duration: measured ? 350 : 0 });
        setMeasured(true);
      },
      [containerLayout, measured, scale],
    );

    const handleContainerLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => setContainerLayout(layout);

    const renderValues = useCallback(() => {
      const numbers = /\d/;
      const partsOfValue: string[] = String(value).split('');
      return partsOfValue.map((valuePart, index) => {
        return numbers.test(valuePart) ? (
          <Tick color={color} type={type} key={index} fontSize={fontSize} lineHeight={lineHeight} value={valuePart} />
        ) : (
          <Label color={color} type={type} key={index} entering={FadeIn} allowFontScaling={false} style={{ lineHeight, fontSize }}>
            {valuePart}
          </Label>
        );
      });
    }, [value, color, type, fontSize, lineHeight]);

    const scaleStyle = useAnimatedStyle(() => {
      if (!containerLayout) {
        return {};
      }
      return {
        transform: [{ translateX: -containerLayout.width / 2 }, { scale: scale.value }, { translateX: containerLayout.width / 2 }],
      };
    }, [containerLayout?.width]);

    const renderPrefix = useCallback(
      () =>
        prefix && (
          <Label color={color} type={type} entering={FadeIn} allowFontScaling={false} numberOfLines={1} style={{ fontSize, lineHeight }}>
            {prefix}
          </Label>
        ),
      [color, fontSize, lineHeight, prefix, type],
    );

    const renderSuffix = useCallback(() => {
      if (suffix) {
        return (
          <Label type={type} color={color} entering={FadeIn} allowFontScaling={false} numberOfLines={1} style={{ fontSize, lineHeight }}>
            {suffix}
          </Label>
        );
      }
      if (ticker) {
        return (
          <Label
            entering={FadeIn}
            color={color}
            allowFontScaling={false}
            style={{ height: fontSize, lineHeight, bottom: -tickerBottomOffset, fontSize: tickerFontSize }}
            type={tickerType}>{`  ${ticker}`}</Label>
        );
      }
      return null;
    }, [color, type, fontSize, lineHeight, suffix, tickerBottomOffset, tickerFontSize, tickerType, ticker]);

    
    const renderShadowNode = useCallback(
      () => (
        <Label style={[styles.shadowNode, { fontSize, lineHeight }]} onTextLayout={handleTextLayout}>
          <>
            {renderPrefix()}
            {String(value)}
            {renderSuffix()}
          </>
        </Label>
      ),
      [fontSize, handleTextLayout, lineHeight, renderPrefix, renderSuffix, value],
    );

    return (
      <Animated.View style={[styles.container, scaleStyle, { height }, style]} testID={testID} accessibilityValue={{ text: String(value) }} {...containerProps}>
        <View style={styles.widthMeasure} onLayout={handleContainerLayout} />
        {containerLayout && renderShadowNode()}
        {measured && (
          <View style={{ height: fontSize }}>
            {containerLayout && measured && (
              <View style={[styles.row, { height: fontSize }]}>
                {renderPrefix()}
                {renderValues()}
                {renderSuffix()}
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  widthMeasure: {
    position: 'absolute',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  noOverflow: {
    overflow: 'hidden',
  },
  shadowNode: {
    position: 'absolute',
    opacity: 0,
  },
});
