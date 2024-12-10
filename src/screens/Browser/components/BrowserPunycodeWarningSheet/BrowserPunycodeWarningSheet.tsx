import type React from 'react';

import { useEffect, useRef } from 'react';

import { BlockScreenModal } from '@/components/BlockScreen';
import type { BottomSheetModalRef } from '@/components/BottomSheet';

import loc from '/loc';

interface Props {
  url: string | null;
  showPunycodeWarning: boolean;
  hidePunycodeWarning: () => void;
  ignorePunycodeWarning: () => void;
}

export const BrowserPunycodeWarningSheet: React.FC<Props> = ({ url, showPunycodeWarning, hidePunycodeWarning, ignorePunycodeWarning }) => {
  const blockScreenRef = useRef<BottomSheetModalRef>(null);

  useEffect(() => {
    if (url && showPunycodeWarning) {
      blockScreenRef.current?.present();
    }
  }, [showPunycodeWarning, url]);

  const onGoBack = () => {
    blockScreenRef.current?.close();
    hidePunycodeWarning();
  };

  const onProceed = () => {
    blockScreenRef.current?.close();
    ignorePunycodeWarning();
  };

  return (
    <BlockScreenModal
      ref={blockScreenRef}
      title={loc.onChainSecurity.knownSecurityRiskExclamation}
      message={loc.onChainSecurity.punycodeDomainRiskMessage}
      onDismiss={onGoBack}
      onGoBack={onGoBack}
      onProceed={onProceed}
    />
  );
};
