import { CircleIcon } from '../CircleIcon/CircleIcon';

interface Props {
  size?: number;
  iconSize?: number;
}

export const KrakenIcon = ({ size = 16, iconSize = 10 }: Props) => {
  return <CircleIcon name="kraken" backgroundColor="kraken" size={size} iconSize={iconSize} />;
};
