import * as StoreReview from 'expo-store-review';
import { useCallback } from 'react';

import { InteractionManager } from 'react-native';

import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';

import { useBrowser } from './useBrowser';

import { URLs } from '/config';
import { handleError } from '/helpers/errorHandler';
import { showAlert } from '/helpers/showAlert';
import loc from '/loc';

export const useStoreReviewTask = () => {
  const taskCompleted = useSettingsByKey(RealmSettingsKey.storeReviewTaskCompleted);
  const { setSettings } = useSettingsMutations();
  const { openURL } = useBrowser();
  const onNegativeAnswer = useCallback(
    async () => {
      const feedbackRequested = await showAlert(
        loc.storeReview.nagativeAlertTitle,
        loc.storeReview.negativeAlertMessage,
        loc.storeReview.sendFeedback,
        loc.storeReview.notReally,
      );
      if (feedbackRequested) {
        openURL(URLs.supportContact);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const runIfNeeded = useCallback(() => {
    if (taskCompleted) {
      return;
    }
    InteractionManager.runAfterInteractions(async () => {
      try {
        if (await StoreReview.isAvailableAsync()) {
          const canReview = await showAlert(loc.storeReview.alertTitle, loc.storeReview.alertMessage, loc.storeReview.yes, loc.storeReview.notReally);
          if (canReview) {
            await StoreReview.requestReview();
            setSettings(RealmSettingsKey.storeReviewSubmitted, true);
          } else {
            onNegativeAnswer();
          }
        }
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
      setSettings(RealmSettingsKey.storeReviewTaskCompleted, true);
    });
  }, [onNegativeAnswer, setSettings, taskCompleted]);

  return {
    runIfNeeded,
  };
};
