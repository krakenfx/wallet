import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ListHeader } from '@/components/ListHeader';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { Routes } from '@/Routes';

import { HEADER_HEIGHT } from './consts';

import loc from '/loc';

export const DefiEmptyHeader = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate(Routes.Earn), [navigation]);

  return (
    <Touchable style={styles.defiEmpty} onPress={onPress}>
      <ListHeader title={loc.home.defiEmpty} />
      <SvgIcon size={24} name="chevron-right" color="light100" />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  defiEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: HEADER_HEIGHT,
  },
});
