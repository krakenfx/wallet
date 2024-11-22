import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { analyseUrl } from '@/api/analyseUrl';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { Routes } from '@/Routes';

import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { UrlSecurityLevel } from '../../Browser.types';
import { useBrowserContext } from '../../context/BrowserContext';

import { handleError } from '/helpers/errorHandler';

export const useBlockaidWarning = (url: string | null, ref: React.RefObject<BottomSheetModalRef>) => {
  const navigation = useNavigation();
  const { navigationState, setUrlSecurityLevel, onNavigateBack, onExitBrowser } = useBrowserContext();

  useEffect(() => {
    const checkUrl = async () => {
      if (!url) {
        return;
      }

      try {
        const { isMalicious } = await analyseUrl(url);

        if (isMalicious === null) {
          setUrlSecurityLevel(UrlSecurityLevel.UNVERIFIED);
          return;
        }

        if (isMalicious) {
          ref.current?.present();
          setUrlSecurityLevel(UrlSecurityLevel.UNSAFE);
          return;
        }

        setUrlSecurityLevel(UrlSecurityLevel.SAFE);
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
        setUrlSecurityLevel(UrlSecurityLevel.UNVERIFIED);
      }
    };

    checkUrl();
  }, [url, ref, setUrlSecurityLevel]);

  const ignoreWarning = () => {
    ref.current?.close();

    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.KNOWN_SECURTIY_RISK });
  };

  const navigateBack = () => {
    ref.current?.close();

    if (navigationState.canNavigateBack) {
      onNavigateBack();
    } else {
      onExitBrowser();
    }
  };

  return { ignoreWarning, navigateBack };
};
