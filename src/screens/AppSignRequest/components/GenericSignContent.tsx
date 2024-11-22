import type { Dispatch } from 'react';

import type React from 'react';
import type { NativeMethods } from 'react-native';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

import loc from '/loc';
import type { DefinitionList } from '/modules/wallet-connect/types';

type Props = {
  content: DefinitionList;
  setHasScrolledToEndOfContent: Dispatch<React.SetStateAction<boolean>>;
};

const SCROLL_TO_END_OF_CONTENT_BUTTON_OFFSET = 44;

export const GenericSignContent = ({ content, setHasScrolledToEndOfContent }: Props) => {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView & Readonly<NativeMethods>>(null);
  const endOfContentRef = useRef<View>(null);

  const hasScrolledToEndOfContentOnce = useRef(false);
  const [shouldShowScrollToEndOfContentButton, setShouldShowScrollToEndOfContentButton] = useState(false);
  const [scrollToEndOfContentButtonY, setScrollToEndOfContentButtonY] = useState(-3 * SCROLL_TO_END_OF_CONTENT_BUTTON_OFFSET);

  const onScrollToEndOfContentButtonPress = useCallback(() => {
    setShouldShowScrollToEndOfContentButton(false);
    scrollViewRef.current?.scrollToEnd();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.flashScrollIndicators();
  }, []);

  return (
    <>
      <ScrollView
        persistentScrollbar
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor: colors.light8 }]}
        contentContainerStyle={styles.contentContainer}
        onLayout={({ nativeEvent }) => {
          if (endOfContentRef.current && scrollViewRef.current) {
            endOfContentRef.current.measureLayout(scrollViewRef.current, (left, top, width, height) => {
              const hasOverflowedContent = height > nativeEvent.layout.height;
              if (hasOverflowedContent) {
                setScrollToEndOfContentButtonY(nativeEvent.layout.height - SCROLL_TO_END_OF_CONTENT_BUTTON_OFFSET);
                setShouldShowScrollToEndOfContentButton(true);
              } else {
                setShouldShowScrollToEndOfContentButton(false);
              }

              if (height < nativeEvent.layout.height + nativeEvent.layout.y && !hasScrolledToEndOfContentOnce.current) {
                hasScrolledToEndOfContentOnce.current = true;
                setHasScrolledToEndOfContent(true);
              }
            });
          }
        }}
        onScroll={({ nativeEvent }) => {
          if (endOfContentRef.current && scrollViewRef.current) {
            endOfContentRef.current.measureLayout(scrollViewRef.current, (left, top, width, height) => {
              if (height < nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y && !hasScrolledToEndOfContentOnce.current) {
                hasScrolledToEndOfContentOnce.current = true;
                setHasScrolledToEndOfContent(true);

                setShouldShowScrollToEndOfContentButton(false);
              }
            });
          }
        }}>
        {content.map(({ title, description }, i) => {
          const isLast = i === content.length - 1;

          return description === '' ? (
            <View key={title + '_' + i} ref={isLast ? endOfContentRef : null} />
          ) : (
            <View key={title + '_' + i} ref={isLast ? endOfContentRef : null}>
              <Label type="boldCaption1" color="light50">
                {title}
              </Label>
              <Label color="light100" style={styles.bodyText}>
                {description}
              </Label>
            </View>
          );
        })}
      </ScrollView>
      {}
      <Button
        color="light100"
        disabled={!shouldShowScrollToEndOfContentButton}
        disabledOpacity={0}
        icon="receive"
        iconColor="coreBackground"
        iconSize={16}
        onPress={onScrollToEndOfContentButtonPress}
        size="small"
        style={[styles.scrollToEndOfContentButton, { top: scrollToEndOfContentButtonY }]}
        testID="SignContentScrollToEndOfContentButton"
        text={loc.appSignRequest.scrollToBottomToConfirm}
        textColor="coreBackground"
      />
    </>
  );
};

const styles = StyleSheet.create({
  bodyText: {
    lineHeight: 22,
  },
  container: {
    borderRadius: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  scrollToEndOfContentButton: {
    left: 16,
    paddingVertical: 6,
    position: 'absolute',
  },
});
