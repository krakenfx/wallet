import type React from 'react';
import type { ImageSourcePropType } from 'react-native';

import { Image, StyleSheet, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';

import { useBrowser } from '@/hooks/useBrowser';

import loc from '/loc';

export type AppProps = {
  description: string;
  url: string;
  image: ImageSourcePropType;
  formatDescriptionWithUrl?: boolean;
};

interface Props {
  apps: AppProps[];
}

const entering = new Keyframe({
  0: {
    transform: [{ scale: 0.7 }],
    opacity: 0,
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
});

const AppCard: React.FC<AppProps> = ({ description, url, image, formatDescriptionWithUrl }) => {
  const { openURL } = useBrowser();

  const handlePress = () => openURL(`https://${url}`);

  return (
    <Touchable onPress={handlePress} style={styles.cards}>
      <View style={styles.topCard}>
        <GradientItemBackground backgroundType="modal" />
        <View style={styles.row}>
          <Image source={image} style={styles.image} />
          <View style={styles.content}>
            {formatDescriptionWithUrl ? (
              <Label type="regularTitle1" color="light75">
                {loc.formatString(description, {
                  url: <Label type="boldTitle1">{url}</Label>,
                })}
              </Label>
            ) : (
              <Label type="regularTitle1" color="light75">
                {description}
              </Label>
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottomCard}>
        <GradientItemBackground backgroundType="modal" />
        <View style={styles.row}>
          <Label color="light75" type="mediumBody">
            {loc.walletConnectExplainer.fourthPage.website}
          </Label>
          <Label color="light100" type="mediumBody">
            {url}
          </Label>
        </View>
        <SvgIcon name="chevron-right" />
      </View>
    </Touchable>
  );
};

export const ExampleAppList: React.FC<Props> = ({ apps }) => {
  return (
    <Animated.View entering={entering.duration(300).delay(500)}>
      {apps.map((appProps, i) => (
        <AppCard key={i} {...appProps} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cards: {
    marginVertical: 8,
  },
  topCard: {
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 1,
  },
  bottomCard: {
    flexDirection: 'row',
    borderRadius: 16,
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingVertical: 12,
    paddingRight: 16,
    overflow: 'hidden',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  image: {
    borderRadius: 25,
    width: 75,
    height: 75,
    marginRight: 16,
  },
  row: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
