import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { useBrowser } from '@/hooks/useBrowser';

import { useDefiDetailsContext } from './DefiDetailsContext';

import loc from '/loc';

export const DefiDetailsOpenDappButton = () => {
  const { openURL } = useBrowser();
  const { vaultLink } = useDefiDetailsContext();
  const onPress = () => openURL(vaultLink);

  return <FloatingBottomButtons primary={{ text: loc.earn.detailsSheet.openDapp, onPress }} />;
};
