import React from 'react';
import { StyleSheet } from 'react-native';

import { IconWithCoinIcon, Props as IconWithCoinIconProps } from '@/components/IconWithCoinIcon';
import { Label } from '@/components/Label';
import { WalletType } from '@/onChain/wallets/registry';

import { Touchable } from './Touchable';

type Props = {
  iconUri: string;
  iconMaskShape?: IconWithCoinIconProps['maskShape'];
  name: string;
  network: WalletType | '';
  onPress: () => void;
  rightElement?: JSX.Element;
  testID?: string;
};

export const AppsListItem = ({ iconMaskShape, name, network, iconUri, onPress, rightElement, testID }: Props) => {
  return (
    <Touchable style={styles.item} onPress={onPress} testID={testID || ''}>
      <IconWithCoinIcon
        coinType={network !== '' ? network : undefined}
        maskPositionXYNudge={4}
        maskShape={iconMaskShape ?? 'rounded-square'}
        iconUri={iconUri}
        size={46}
        coinSize={16}
      />
      <Label type="boldTitle2" style={styles.label} numberOfLines={1}>
        {name}
      </Label>
      {rightElement}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 21,
    paddingVertical: 6,
  },
  label: {
    flex: 1,
    marginLeft: 9,
  },
});
