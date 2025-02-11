import type { SharedValue } from 'react-native-reanimated';

export interface DefiProtocolPositionsProps {
  protocol: {
    id: string;
    protocolName: string;
    protocolIcon: string;
    totalValue: number;
    positions: Position[];
  };
}

export interface Position {
  id: string;
  apr: number;
  isDebt: boolean;
  token: {
    assetId: string;
    balance: string;
  };
}

export interface DefiProtocolHeadingProps {
  protocolName: string;
  protocolIcon: string;
  nOfPositions: number;
  totalValue: number;
  isExpanded: SharedValue<boolean>;
  onToggle: () => void;
}

export interface DefiProtocolPositionsRowProps {
  position: Position;
}
