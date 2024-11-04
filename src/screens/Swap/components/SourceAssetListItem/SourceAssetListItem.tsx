import React, { useCallback, useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { AssetRow } from '@/components/AssetRow';
import { ReputationTag } from '@/components/Reputation';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import type { RealmToken } from '@/realm/tokens';

type Props = {
  token: RealmToken;
  onSelected: (token: RealmToken) => void;
  selected?: boolean;
};

export const SourceAssetListItem = ({ token, selected, onSelected }: Props) => {
  const reputation = useReputation(token.assetId);
  const onPress = useCallback(() => onSelected(token), [onSelected, token]);

  const options = useMemo(
    () => ({
      onPress,
      tag: <ReputationTag assetId={token.assetId} reputation={reputation} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />,
      testID: `SwapSourceAssetRow-${token.assetId}`,
      hideZeroAmount: false,
      showAmountInFiat: true,
      walletId: token.walletId,
      style: styles.item,
      readonly: false,
      disableLongPress: true,
      selected,
    }),
    [onPress, reputation, selected, token.assetId, token.walletId],
  );

  return <AssetRow token={token} options={options} />;
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 52,
  },
});
