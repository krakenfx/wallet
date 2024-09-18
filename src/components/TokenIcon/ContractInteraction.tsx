import React from 'react';
import { StyleSheet } from 'react-native';

import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import { SvgIcon } from '@/components/SvgIcon';
import { WalletType } from '@/onChain/wallets/registry';
import { RealmWallet } from '@/realm/wallets';
import { useTheme } from '@/theme/themes';

import { NETWORK_ICON_BORDER_TO_TOKEN_RATIO, NETWORK_ICON_TO_TOKEN_RATIO } from './constants';

type ContractInteractionProps = {
  forceOmitNetworkIcon?: boolean;
  wallet: Pick<RealmWallet, 'nativeTokenLabel' | 'type'>;
};

export const ContractInteraction: React.FC<ContractInteractionProps> = ({ wallet, forceOmitNetworkIcon }) => {
  const networkName_ = wallet.nativeTokenLabel || '';
  const size = 40;
  const { colors } = useTheme();

  return (
    <MaskedElementWithCoin
      size={size}
      coinSize={forceOmitNetworkIcon ? 0 : NETWORK_ICON_TO_TOKEN_RATIO * size}
      coinBorderSize={NETWORK_ICON_BORDER_TO_TOKEN_RATIO * size}
      coinType={wallet?.type ?? (networkName_ as WalletType) ?? 'walletTypeUnknown'}
      maskedElement={<SvgIcon name="sheet" style={[styles.sheetIcon, { backgroundColor: colors.light8 }]} gradientIconBackground />}
    />
  );
};

const styles = StyleSheet.create({
  sheetIcon: {
    justifyContent: 'center',
    borderRadius: 20,
    height: 40,
    width: 40,
    marginRight: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
});
