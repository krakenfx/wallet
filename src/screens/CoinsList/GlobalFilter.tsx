import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { SvgIcon } from '@/components/SvgIcon';
import { Routes } from '@/Routes';

type Props = {
  children: React.ReactNode;
};

export const GlobalFilter = ({ children }: Props) => {
  const navigation = useNavigation();

  return <SvgIcon name="filter" size={24} onPress={() => navigation.navigate(Routes.ManageAssetsGlobalFilter, { content: children })} />;
};
