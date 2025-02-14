import { useDefiDetailsContext } from '../DefiDetailsContext';

import { DefiDetailsHeaderBalance } from './DefiDetailsHeaderBalance';
import { DefiDetailsHeaderProtocol } from './DefiDetailsHeaderProtocol';

export const DefiDetailsHeader = () => {
  const { protocolDescription, protocolName, vaultBalance } = useDefiDetailsContext();

  if (vaultBalance) {
    return <DefiDetailsHeaderBalance vaultBalance={vaultBalance} />;
  }

  return <DefiDetailsHeaderProtocol protocolName={protocolName} protocolDescription={protocolDescription} />;
};
