import type { SectionListProps } from 'react-native';

import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { InteractionManager, Platform } from 'react-native';

import { useCurrentAccountNumber } from '@/realm/accounts';
import { runAfterUISync } from '@/utils/runAfterUISync';

export function HomeAssetPanelSectionList<ItemT, SectionT>(props: SectionListProps<ItemT, SectionT>) {
  const accountNumber = useCurrentAccountNumber();

  const [listVisible, setListVisible] = useState(false);
  const [windowSize, setWindowSize] = useState(1);
  const hasRenderDelay = useRef(Platform.OS === 'android');

  const lastAccount = useRef(accountNumber);

  useEffect(() => {
    const newHandle = InteractionManager.createInteractionHandle();
    lastAccount.current = accountNumber;
    setListVisible(false);
    setWindowSize(1);
    runAfterUISync(
      () => {
        setListVisible(true);
        runAfterUISync(() => {
          InteractionManager.clearInteractionHandle(newHandle);
          setWindowSize(10);
        }, 5);
      },
      hasRenderDelay.current ? 10 : 1,
    );
    return () => {
      InteractionManager.clearInteractionHandle(newHandle);
    };
  }, [accountNumber]);

  useEffect(() => {
    hasRenderDelay.current = false;
  }, []);

  if (!listVisible || lastAccount.current !== accountNumber) {
    return null;
  }

  return <BottomSheetSectionList {...props} initialNumToRender={7} windowSize={windowSize} />;
}
