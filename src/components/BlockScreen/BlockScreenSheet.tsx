import React from 'react';

import { BottomSheet } from '@/components/BottomSheet';

import { BlockScreenContent } from './BlockScreenContent';

import type { BlockScreenProps } from './BlockScreenContent';

export const BlockScreenSheet: React.FC<BlockScreenProps> = React.memo(props => (
  <BottomSheet snapPoints={['100%']} onDismiss={props.onGoBack} isWarning>
    <BlockScreenContent {...props} />
  </BottomSheet>
));
