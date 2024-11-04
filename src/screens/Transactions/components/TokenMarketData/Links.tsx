import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBrowser } from '@/hooks/useBrowser';
import type { AssetMetadata } from '@/realm/assetMetadata';

import loc from '/loc';

interface Props {
  links?: AssetMetadata['links'];
}

type LinkIconName = Extract<IconName, `link-${string}`>;


type Unlink<Str extends string> = Str extends `link-${infer Rest}` ? Rest : never;


type UnlinkedIconName = Unlink<LinkIconName>;

const namesWithLinks: UnlinkedIconName[] = [
  'discord',
  'farcaster',
  'reddit',
  'instagram',
  'facebook',
  'bitcointalk',
  'medium',
  'substack',
  'github',
  'bitbucket',
  'zealy',
];

interface ItemProps {
  url: string;
  skipLabel?: boolean;
}

interface IconMapping {
  [key: string]: IconName;
}

const iconMappings: IconMapping = {
  '//x.com': 'link-x-social',
  '//t.me': 'link-telegram',
};

const LinkItem = ({ url, skipLabel }: ItemProps) => {
  const { openURL } = useBrowser();

  const getIconAndLabel = () => {
    let icon: IconName | undefined;
    let label: string | undefined;
    for (const name of namesWithLinks) {
      if (url.includes(name)) {
        icon = `link-${name}`;
        break;
      }
    }
    if (!icon) {
      for (const domain in iconMappings) {
        if (url.includes(domain)) {
          icon = iconMappings[domain];
          break;
        }
      }
    }
    if (!icon) {
      icon = 'web3-globe';
      label = loc.marketData.website;
    }

    return {
      icon,
      label: skipLabel ? undefined : label,
    };
  };
  const { icon, label } = getIconAndLabel();

  const onPress = () => openURL(url);

  return (
    <Touchable style={[styles.item, !!label && styles.itemWithLabel]} onPress={onPress} testID={`Link-${icon}`}>
      <GradientItemBackground />
      <SvgIcon name={icon} size={24} color="light75" />
      {!!label && (
        <Label type="regularCaption1" color="light75" style={styles.label}>
          {label}
        </Label>
      )}
    </Touchable>
  );
};

export const Links = ({ links }: Props) => {
  if (!links || links.length === 0) {
    return null;
  }
  const skipWebsiteLabel = links.length > 4;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="LinksSection">
      <Label type="boldTitle2" style={styles.header}>
        {loc.marketData.links}
      </Label>
      <View style={styles.linksRow}>
        {links.map(link => (
          <LinkItem key={link.name} url={link.url} skipLabel={skipWebsiteLabel} />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 8,
    overflow: 'hidden',
    height: 42,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWithLabel: {
    paddingRight: 12,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  label: {
    marginLeft: 4,
  },
  header: {
    marginBottom: 10,
  },
});
