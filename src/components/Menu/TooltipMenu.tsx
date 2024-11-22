import type React from 'react';

import { Label, type LabelProps } from '@/components/Label';

import { Tooltip, type Props as TooltipProps } from '../Tooltip';

export type TooltipMenuProps = {
  tooltipProps?: LabelProps;
  tooltip: string;
  horizontalTipOffset?: number;
};

type TooltipPositionProps = {
  horizontalAlign?: TooltipProps['horizontalAlign'];
  verticalAlign?: TooltipProps['verticalAlign'];
};

export const TooltipMenu: React.FC<TooltipMenuProps & TooltipPositionProps> = ({
  tooltip,
  tooltipProps,
  horizontalAlign,
  verticalAlign,
  horizontalTipOffset,
}) => {
  return (
    <Tooltip horizontalAlign={horizontalAlign} verticalAlign={verticalAlign} horizontalTipOffset={horizontalTipOffset}>
      <Label color="light75" type="regularBody" {...tooltipProps}>
        {tooltip}
      </Label>
    </Tooltip>
  );
};
