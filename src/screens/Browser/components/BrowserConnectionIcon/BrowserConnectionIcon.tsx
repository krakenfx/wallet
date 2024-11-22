import { SvgIcon } from '@/components/SvgIcon';

import { useConnectionContext } from '../../context/ConnectionContext';

export const BrowseConnectionIcon = () => {
  const { isConnected } = useConnectionContext();

  if (isConnected) {
    return <SvgIcon name="plug-connected" color="light100" size={16} />;
  }

  return <SvgIcon name="plug-disconnected" color="light15" size={16} />;
};
