import { useNavigation } from '@react-navigation/native';
import { noop } from 'lodash';

import type { ExploreLink } from '@/api/types';
import { Routes } from '@/Routes';

import { useExploreAnimationContext } from '../context/ExploreAnimationContext';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export const useExploreLink = (link: ExploreLink | undefined) => {
  const navigation = useNavigation();
  const { openLinkWithTransition } = useExploreAnimationContext();

  if (link === undefined) {
    return noop;
  }

  
  if (link?.isInternal) {
    return () => {
      try {
        navigation.navigate(Routes.ExploreSubpage, { slug: link?.slug });
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.errors.exploreSubpage });
      }
    };
  }

  
  if (!link?.isInternal) {
    return () => {
      openLinkWithTransition(link?.url);
    };
  }
};
