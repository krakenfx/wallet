import type React from 'react';

import { AssetSwitch } from '@/components/AssetSwitch';
import { useTokenSwitch } from '@/hooks/useTokenSwitch';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import type { RemoteAsset } from '@/types';

type RemoteAssetRowProps = {
  remoteAsset: RemoteAsset;
  tokensGalleryLength: number;
};

export const RemoteAssetRow: React.FC<RemoteAssetRowProps> = ({ remoteAsset, tokensGalleryLength }) => {
  const wallet = useWalletByAssetId(remoteAsset.assetId);

  const { shouldRender, isTokenInGallery, onSwitch } = useTokenSwitch({
    token: remoteAsset,
    tokensGalleryLength,
    options: {
      isRemoteAsset: true,
      wallet,
    },
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
        networkName: wallet?.type,
        walletId: wallet?.id,
        hideZeroAmount: true,
        showAmountInFiat: false,
        symbolUnderLabel: true,
      }}
    />
  );
};
