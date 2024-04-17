import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

export function useIsAppBlurred() {
  const [isBlurred, setIsBlurred] = useState(Platform.OS === 'android' ? AppState.currentState !== 'active' : false);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const blurSubscription = AppState.addEventListener('blur', () => {
      setIsBlurred(true);
    });
    const focusSubscription = AppState.addEventListener('focus', () => {
      setIsBlurred(false);
    });

    return () => {
      blurSubscription.remove();
      focusSubscription.remove();
    };
  }, []);

  return isBlurred;
}
