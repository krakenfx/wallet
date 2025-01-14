import { useCallback, useMemo } from 'react';

import { StyleSheet } from 'react-native';

import type { AssetRowProps } from '@/components/AssetRow';
import { AssetRow } from '@/components/AssetRow';
import { ReputationTag } from '@/components/Reputation';
import { REPUTATION, getReputation } from '@/hooks/useReputation';
import { useTokenListReputation } from '@/hooks/useTokenListReputation';
import { getNetworkNameFromAssetId } from '@/realm/tokens';
import type { RealmWallet } from '@/realm/wallets';

import type { SwapTargetAsset } from '../../types';
import type { Dictionary } from 'lodash';

type Props = {
  token: SwapTargetAsset;
  wallets: Dictionary<RealmWallet>;
  onSelected: (token: SwapTargetAsset) => void;
  selected?: boolean;
};

export const TargetAssetListItem = ({ token, wallets, selected, onSelected }: Props) => {
  const networkName = getNetworkNameFromAssetId(token.assetId);
  const wallet = wallets[networkName];

  const assetReputation = useTokenListReputation(token.assetId);
  const onPress = useCallback(() => onSelected(token), [onSelected, token]);

  const options = useMemo(
    () =>
      ({
        onPress,
        tag: (
          <ReputationTag
            assetId={token.assetId}
            reputation={getReputation(assetReputation)}
            filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }}
          />
        ),
        testID: `SwapTargetAssetRow-${token.assetId}`,
        hideZeroAmount: true,
        hideZeroAmountFiat: true,
        showAmountInFiat: true,
        walletId: wallet.id,
        style: styles.item,
        readonly: false,
        disableLongPress: true,
        selected,
      }) satisfies AssetRowProps['options'],
    [onPress, assetReputation, selected, token.assetId, wallet.id],
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
