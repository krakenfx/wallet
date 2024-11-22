import type React from 'react';

import { useRef } from 'react';

import { BlockScreenModal } from '@/components/BlockScreen';
import type { BottomSheetModalRef } from '@/components/BottomSheet';

import { useBlockaidWarning } from './useBlockaidWarning';

import loc from '/loc';

interface Props {
  url: string | null;
}

export const BrowserBlockaidWarningSheet: React.FC<Props> = ({ url }) => {
  const blockScreenRef = useRef<BottomSheetModalRef>(null);
  const { ignoreWarning, navigateBack } = useBlockaidWarning(url, blockScreenRef);

  return (
    <BlockScreenModal
      ref={blockScreenRef}
      title={loc.onChainSecurity.knownSecurityRiskExclamation}
      message={loc.onChainSecurity.knownSecurityRiskMessage}
      onDismiss={navigateBack}
      onGoBack={navigateBack}
      onProceed={ignoreWarning}
    />
  );
};
