import type { ReactElement } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AccordionItem } from '@/components/AccordionItem';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  leftIcon: ReactElement;
  leftLabelColor: ColorName;
  infoLabel: string | (string | number)[];
  children: ReactElement | ReactElement[];
  rightLabelElementClosed: ReactElement;
  rightLabelElementOpened: string;
  isWarning?: boolean;
}

const ANIMATION_TIME = 500;

export const ReputationAccordion = ({ children, leftIcon, infoLabel, rightLabelElementClosed, rightLabelElementOpened, leftLabelColor, isWarning }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const isExpanded = useSharedValue(false);

  const toggle = () => {
    setIsOpen(prev => !prev);
    isExpanded.value = !isExpanded.value;
  };

  const withWarningColor = isWarning && !isOpen;
  const chevronColor: ColorName = withWarningColor ? 'red400' : 'light75';

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(withWarningColor ? colors.red400_15 : colors.transparent),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Touchable style={[styles.mainRow]} onPress={toggle}>
        <GradientItemBackground key={String(isOpen)} />

        <View style={styles.leftContainer}>
          {leftIcon}
          <Label color={leftLabelColor} type="boldBody" style={styles.leftLabel}>
            {infoLabel}
          </Label>
        </View>

        <View style={styles.rightContainer}>
          {isOpen && (
            <Label entering={FadeIn.duration(ANIMATION_TIME)} type="boldBody" color="light75">
              {rightLabelElementOpened}
            </Label>
          )}
          {!isOpen && <Animated.View entering={FadeIn.duration(ANIMATION_TIME)}>{rightLabelElementClosed}</Animated.View>}

          <SvgIcon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} style={styles.iconChevron} color={chevronColor} />
        </View>
      </Touchable>
      <AccordionItem isExpanded={isExpanded}>
        <>
          <GradientItemBackground />
          {children}
        </>
      </AccordionItem>

      <AccordionItem isExpanded={isExpanded}>
        <Touchable
          style={styles.infoRow}
          onPress={() => {
            navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.TOKEN_LISTS });
          }}>
          <GradientItemBackground />
          <View style={styles.infoLabel}>
            <SvgIcon name="info-circle" size={20} color="light75" style={styles.infoIcon} />
            <Label color="light50" type="boldBody">
              {loc.tokenLists.help}
            </Label>
          </View>
          <SvgIcon name="chevron-right" size={20} color="light75" />
        </Touchable>
      </AccordionItem>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  leftIcon: {
    marginRight: 4,
  },
  iconChevron: {
    marginLeft: 12,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoRow: {
    marginTop: 1,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftLabel: {
    marginLeft: 4,
    lineHeight: 20,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
