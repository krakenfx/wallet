import keyBy from 'lodash/keyBy';
import React from 'react';

import { AssetSwitch } from '@/components/AssetSwitch';
import { useTokenSwitch } from '@/hooks/useTokenSwitch';
import { getNetworkNameFromAssetId } from '@/realm/tokens';
import { useRealmWallets } from '@/realm/wallets';
import { RemoteAsset } from '@/types';

type RemoteAssetRowProps = {
  remoteAsset: RemoteAsset;
  tokensGalleryLength: number;
};

export const RemoteAssetRow: React.FC<RemoteAssetRowProps> = ({ remoteAsset, tokensGalleryLength }) => {
  const realmWallets = useRealmWallets();
  const wallets = keyBy(Array.from(realmWallets), 'type');
  const networkName = getNetworkNameFromAssetId(remoteAsset.assetId);
  const wallet = wallets[networkName];

  const { shouldRender, isTokenInGallery, onSwitch } = useTokenSwitch({
    token: remoteAsset,
    tokensGalleryLength,
    options: {
      isRemoteAsset: true,
      wallet
    }
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <AssetSwitch
      token={remoteAsset}
      value={isTokenInGallery}
      onValueChange={onSwitch}
      options={{
        networkName,
        walletId: wallet.id,
        hideZeroAmount: true,
        showAmountInFiat: false,
        symbolUnderLabel: true,
      }}
    />
  );
};
