import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import type { IconButtonProps } from '@/components/IconButton';
import { IconButton } from '@/components/IconButton';

export const BackButton: React.FC<Omit<IconButtonProps, 'name'>> = props => {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) {
    return null;
  }

  return <IconButton containerStyle={styles.backButton} name="chevron-left" size={20} onPress={navigation.goBack} testID="GoBackButton" {...props} />;
};

const styles = StyleSheet.create({
  backButton: {
    marginRight: Platform.select({ android: 8, default: 2 }), 
  },
});


export const DefaultBackButton = () => <BackButton />;
