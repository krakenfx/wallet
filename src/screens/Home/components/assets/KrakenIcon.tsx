import { CircleIcon } from '@/components/CircleIcon/CircleIcon';

interface Props {
  size?: number;
  iconSize?: number;
}

export const KrakenIcon = ({ size = 16 }: Props) => {
  return <CircleIcon name="kraken" backgroundColor="kraken" size={size} iconSize={10} />;
};
