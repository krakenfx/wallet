import { StyleSheet, View } from 'react-native';

import type { KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { type WalletType } from '@/onChain/wallets/registry';
import { useTheme } from '@/theme/themes';

import { getWalletNetworkByNetworkId } from '../utils';

import loc from '/loc';

interface Props {
  method: KrakenWithdrawMethod;
  assetSymbol: string;
  onSelect: (method: KrakenWithdrawMethod) => void;
}

export const NetworkItem = ({ method, assetSymbol, onSelect }: Props) => {
  const { colors } = useTheme();
  const network = getWalletNetworkByNetworkId(method.network_id);

  if (!network) {
    return null;
  }

  const feePercentage = method.fee.fee_percentage ? ` +${method.fee.fee_percentage}%` : '';
  const fee = loc.formatString(loc.krakenConnect.selectNetwork.fee, { assetValue: `${method.fee.fee} ${assetSymbol}${feePercentage}` });
  const minLabel = loc.formatString(loc.krakenConnect.selectNetwork.minimum, { assetValue: `${method.minimum} ${assetSymbol}` });

  const handleSelect = () => {
    onSelect(method);
  };

  return (
    <Touchable style={[styles.listItem, { backgroundColor: colors.purple_15 }]} key={method.network_id} onPress={handleSelect}>
      <View style={styles.left}>
        <View style={styles.itemHeader}>
          <NetworkIcon networkName={network.type as WalletType} size={28} />
          <Label type="boldTitle2">{method.network}</Label>
        </View>
        <View style={styles.fees}>
          <View style={[styles.bottomPill, { backgroundColor: colors.purple_15, borderColor: colors.purple_20 }]}>
            <Label type="mediumCaption2" color="light50">
              {fee}
            </Label>
          </View>
          <View style={[styles.bottomPill, { backgroundColor: colors.purple_15, borderColor: colors.purple_20 }]}>
            <Label type="mediumCaption2" color="light50">
              {minLabel}
            </Label>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <SvgIcon name="chevron-right" size={24} />
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    height: 82,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  left: {
    justifyContent: 'space-between',
    flex: 1,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 36,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomPill: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  fees: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
  },
});
