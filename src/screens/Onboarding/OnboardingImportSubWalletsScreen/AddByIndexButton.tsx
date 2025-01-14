import type { GestureResponderEvent } from 'react-native';

import { Button } from '@/components/Button';

import loc from '/loc';

type Props = { onPress: ((event: GestureResponderEvent) => void) | undefined };

export const AddByIndexButton = ({ onPress }: Props) => (
  <Button icon="plus" iconSize={16} iconColor="light50" text={loc.onboardingImportSubWallets.addByIndex.button} textColor="light75" onPress={onPress} />
);
