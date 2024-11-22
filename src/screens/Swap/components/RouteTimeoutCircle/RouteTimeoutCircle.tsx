import type React from 'react';

import { AnimatedProgressCircle, type Props } from '@/components/AnimatedProgressCircle';

export const RouteTimeoutCircle: React.FC<Props> = props => {
  return <AnimatedProgressCircle size={16} strokeWidth={1.5} {...props} />;
};
