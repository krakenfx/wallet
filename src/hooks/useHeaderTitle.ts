import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

import { useLanguage } from '@/realm/settings';

export const useHeaderTitle = (title: string) => {
  const language = useLanguage();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [language, navigation, title]);
};
