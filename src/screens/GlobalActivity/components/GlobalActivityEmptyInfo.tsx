import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';

import loc from '/loc';

interface Props {
  image: React.ReactElement;
  heading: string;
  description: string;
  cta?: React.ReactElement;
}

const EmptyInfo = ({ image, heading, description, cta }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>{image}</View>
      <View>
        <Label type="boldTitle0" style={styles.heading}>
          {heading}
        </Label>
        <View style={styles.bodyContainer}>
          <Label type="regularBody" color="light75" style={styles.label}>
            {description}
          </Label>
        </View>
        {!!cta && <View style={styles.cta}>{cta}</View>}
      </View>
    </View>
  );
};

interface GlobalActivityEmptyAllProps {
  navigation: NavigationProps<'GlobalActivity'>['navigation'];
}

export const GlobalActivityEmptyAll = ({ navigation: { navigate } }: GlobalActivityEmptyAllProps) => {
  const onReceivePress = () => navigate(Routes.UniversalReceive);

  return (
    <EmptyInfo
      image={<Image source={require('@/assets/images/transactions/zero_state_tx.png')} />}
      heading={loc.globalActivity.noActivity.title}
      description={loc.globalActivity.noActivity.description}
      cta={
        <>
          <Button color="light15" onPress={onReceivePress} style={styles.receiveBtn} icon="receive" iconSize={22} />
          <Label type="boldCaption1" color="light50">
            {loc.universalReceive.buttonTitle}
          </Label>
        </>
      }
    />
  );
};

export const GlobalActivityEmptyNetworkSelection = () => (
  <EmptyInfo
    image={<Image source={require('@/assets/images/common/search.png')} />}
    heading={loc.globalActivity.emptySelection.title}
    description={loc.globalActivity.emptySelection.description}
  />
);

const styles = StyleSheet.create({
  container: {
    marginTop: 130,
    paddingHorizontal: 24,
  },
  bodyContainer: {
    marginTop: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
  },
  cta: {
    marginTop: 16,
    alignItems: 'center',
  },
  receiveBtn: {
    width: 64,
    height: 64,
    borderRadius: 64,
    marginBottom: 8,
  },
});
