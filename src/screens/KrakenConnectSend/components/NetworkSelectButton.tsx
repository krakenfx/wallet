import { StyleSheet, View } from 'react-native';

import type { KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import type { WalletType } from '@/onChain/wallets/registry';
import { getNetworkByNetworkId } from '@/screens/KrakenConnectSend/utils';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  selectedMethod?: KrakenWithdrawMethod;
  onPress: () => void;
  isOpen: boolean;
}

export const NetworkSelectButton = ({ selectedMethod, onPress, isOpen }: Props) => {
  const { colors } = useTheme();
  const network = selectedMethod && getNetworkByNetworkId(selectedMethod.network_id);

  const networkIconName = network?.name || 'selectNetwork';
  const label = selectedMethod
    ? loc.formatString(loc.krakenConnect.selectNetwork.network, { selectedNetworkName: selectedMethod.network })
    : loc.krakenConnect.selectNetwork.title;

  return (
    <Touchable style={[styles.container, { backgroundColor: colors.dark25 }]} onPress={onPress}>
      <View style={styles.label}>
        <NetworkIcon networkName={networkIconName as WalletType} size={33} />
        <Label type="boldBody">{label}</Label>
      </View>
      <SvgIcon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    borderRadius: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
