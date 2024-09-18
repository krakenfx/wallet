import { useIsFocused } from '@react-navigation/native';

import { useEffect, useState } from 'react';

import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';
import { useAppState } from '@/utils/useAppState';

const useSeed = () => {
  const [seed, setSeed] = useState<string>();
  const { getMnemonic } = useSecuredKeychain();

  const fetchSeed = async () => {
    const res = await getMnemonic();
    if (res) {
      setSeed(res);
    }
  };

  return {
    seed,
    fetchSeed,
  };
};

export const useSeedPhrase = (initiallyRevealed = false) => {
  const [isSeedVisible, setIsSeedVisible] = useState(initiallyRevealed);
  const { seed, fetchSeed } = useSeed();
  const isFocused = useIsFocused();
  const [seedToShow, setSeedToShow] = useState<string>();

  const appState = useAppState();

  useEffect(() => {
    if (appState !== 'active') {
      setIsSeedVisible(false);
      setSeedToShow(undefined);
    }
  }, [appState]);

  useEffect(() => {
    async function fetchAndShowSeed() {
      await fetchSeed();
      setIsSeedVisible(true);
    }

    if (initiallyRevealed && !seedToShow && isFocused) {
      fetchAndShowSeed();
    }
  }, [fetchSeed, initiallyRevealed, isFocused, seedToShow]);

  const onSeedReveal = async () => {
    if (!seedToShow) {
      await fetchSeed();
    }
    safelyAnimateLayout();
    setIsSeedVisible(true);
  };

  return {
    seed,
    isSeedVisible,
    onSeedReveal,
  };
};
