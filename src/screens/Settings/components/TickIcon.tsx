import { SvgIcon } from '@/components/SvgIcon';

export const TickIcon = ({ enabled }: { enabled: boolean }) => {
  return <SvgIcon name="check-circle-filled" color={enabled ? 'green500' : 'light100'} style={{ opacity: enabled ? 1 : 0.5 }} />;
};
