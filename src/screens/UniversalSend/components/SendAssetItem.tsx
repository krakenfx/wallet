import React, { useCallback, useMemo } from 'react';
import Animated, { EntryExitAnimationFunction, withTiming } from 'react-native-reanimated';

import { AssetRow } from '@/components/AssetRow';
import { ReputationTag } from '@/components/Reputation';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import { RealmToken } from '@/realm/tokens';

type Props = {
  token: RealmToken;
  index: number;
  onSelected: (token: RealmToken) => void;
  shouldAnimateIn: boolean;
};

const EnteringAnimation =
  (index: number): EntryExitAnimationFunction =>
  () => {
    'worklet';
    const animations = {
      opacity: withTiming(1, { duration: 300 }),
      transform: [{ translateY: withTiming(0, { duration: 300 }) }],
    };
    const initialValues = { opacity: 0, transform: [{ translateY: 20 + index * 30 }] };
    return { initialValues, animations };
  };

export const SendAssetItem = ({ token, index, shouldAnimateIn, onSelected }: Props) => {
  const reputation = useReputation(token.assetId);
  const onPress = useCallback(() => onSelected(token), [onSelected, token]);

  const entering = useMemo(() => (shouldAnimateIn ? EnteringAnimation(index) : undefined), [index, shouldAnimateIn]);

  const options = useMemo(
    () => ({
      onPress,
      tag: <ReputationTag assetId={token.assetId} reputation={reputation} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />,
      testID: `SendAssetRow-${token.assetId}`,
      hideZeroAmount: false,
      showAmountInFiat: true,
      walletId: token.walletId,
      readonly: false,
    }),
    [onPress, reputation, token.assetId, token.walletId],
  );

  return (
    <Animated.View entering={entering} testID={`SendAssetItem-${token.assetId}`}>
      <AssetRow token={token} options={options} />
    </Animated.View>
  );
};
