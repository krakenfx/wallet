import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { ReputationTag } from '@/components/Reputation';
import { SvgIcon } from '@/components/SvgIcon';
import { TokenIcon } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { REPUTATION } from '@/hooks/useReputation';
import type { RealmWallet } from '@/realm/wallets';
import { useTheme } from '@/theme/themes';

import type { SwapTargetAsset } from '../../types';

type Props = {
  asset: SwapTargetAsset;
  wallet?: RealmWallet;
  reputation?: REPUTATION;

  onPress: () => void;
};

export const SwapAssetSelector: React.FC<Props> = ({ onPress, asset, wallet, reputation }) => {
  const { colors } = useTheme();

  return (
    <Touchable onPress={onPress} style={[styles.container, { backgroundColor: colors.purple_40 }]}>
      <TokenIcon forceNetworkIcon wallet={wallet} tokenId={asset.assetId} tokenSymbol={asset.metadata.symbol} />
      <View style={styles.labelRow}>
        <Label>{asset.metadata.symbol}</Label>
        {reputation && (
          <ReputationTag assetId={asset.assetId} reputation={reputation} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />
        )}
      </View>
      <SvgIcon size={16} name="chevron-down" style={styles.chevron} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 4,
    borderRadius: 100,
    paddingRight: 12,
    overflow: 'hidden',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chevron: {
    marginLeft: -4,
  },
});
