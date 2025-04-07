import { StyleSheet, View } from 'react-native';

import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import type { WalletType } from '@/onChain/wallets/registry';
import { useAssetMetadata } from '@/realm/assetMetadata';

import { NETWORK_ICON_BORDER_TO_TOKEN_RATIO, NETWORK_ICON_TO_TOKEN_RATIO } from './constants';
import { getBundledTokenIcon } from './getBundledTokenIcon';
import { getTokenNetworkName } from './getTokenNetworkName';
import { shouldOmitNetworkIcon } from './shouldOmitNetworkIcon';
import { TokenIconFallback } from './TokenIconFallback';
import { useKrakenAssetsIcon } from './useKrakenAssetsIcon';

import { useLogoUrlAssetsIcon } from './useLogoUrlAssetsIcon';

import type { TokenIconProps } from './TokenIconProps';

export const TokenIcon = (props: TokenIconProps) => {
  const { networkName, tokenId, tokenSymbol, wallet, style, size = 40, testID } = props;
  const metadata = useAssetMetadata({ assetId: tokenId || '' });
  const omitNetworkIcon = shouldOmitNetworkIcon(props);
  const tokenNetworkName = getTokenNetworkName({ networkName, tokenId });

  const bundledIcon = getBundledTokenIcon({ tokenSymbol, tokenNetworkName, style: styles.icon, size });

  const shouldFetchKrakenAsset = bundledIcon === undefined;
  const krakenAssetsIcon = useKrakenAssetsIcon(
    { tokenAddress: metadata?.tokenAddress, style: [styles.icon, { width: size, height: size }] },
    shouldFetchKrakenAsset,
  );

  const shouldFetchLogoUrl = bundledIcon === undefined && krakenAssetsIcon.icon === null;
  const logoUrlAssetsIcon = useLogoUrlAssetsIcon({ logoUrl: metadata?.logoUrl, style: [styles.icon, { width: size, height: size }] }, shouldFetchLogoUrl);

  const assetIcon = bundledIcon ?? krakenAssetsIcon.icon ?? logoUrlAssetsIcon.icon;
  const wrappedIcon = assetIcon && <View style={[styles.ball, { width: size, height: size, borderRadius: size / 2 }, style]}>{assetIcon}</View>;

  const fallbackIcon = <TokenIconFallback size={size} style={style} tokenSymbol={tokenSymbol ?? ''} />;

  return (
    <MaskedElementWithCoin
      size={size}
      coinSize={omitNetworkIcon ? 0 : NETWORK_ICON_TO_TOKEN_RATIO * size}
      coinBorderSize={NETWORK_ICON_BORDER_TO_TOKEN_RATIO * size}
      coinType={wallet?.type ?? (tokenNetworkName as WalletType) ?? 'walletTypeUnknown'}
      maskedElement={wrappedIcon ?? fallbackIcon}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  ball: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '60%',
    height: '60%',
    backgroundColor: '#ffffff',
  },
});
