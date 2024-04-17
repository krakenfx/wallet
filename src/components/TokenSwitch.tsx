import React from 'react';

import { RealmToken, useTokensMutations } from '@/realm/tokens';
import { useTokensGalleryMutations } from '@/realm/tokensGallery';
import { RealmWallet } from '@/realm/wallets';
import { RemoteAsset } from '@/screens/CoinsList/types';
import { isRealmToken } from '@/screens/CoinsList/utils/isRealmToken';
import { isRealmObject } from '@/utils/isRealmObject';

import { AssetRowProps } from './AssetRow';
import { AssetSwitch } from './AssetSwitch';

type TokenSwitchProps = Omit<AssetRowProps, 'token'> & {
  token: RealmToken | RemoteAsset;
  tokensGalleryLength: number;
  options?: {
    wallet?: RealmWallet;
  };
};

export const TokenSwitch = ({ token, tokensGalleryLength, options = {} }: TokenSwitchProps) => {
  const { addTokenToRealm, removeTokenFromRealm } = useTokensMutations();
  const { removeTokenFromGallery, addTokenToGallery } = useTokensGalleryMutations();

  if (isRealmObject(token) && !token.isValid()) {
    return null;
  }

  const isTokenInGallery = isRealmToken(token) && !!token.inGallery;

  const handleValueChange = (value: boolean, walletId?: string) => {
    if (isRealmToken(token)) {
      if (!value && walletId && token.assetId !== token.wallet.nativeTokenCaipId && token.balance === '0') {
        removeTokenFromRealm(walletId, token.assetId);

        return;
      } else {
        if (token.inGallery) {
          removeTokenFromGallery(token);
        } else {
          addTokenToGallery(token);
        }
      }

      return;
    }

    if (options.isRemoteAsset) {
      if (value && options.wallet) {
        addTokenToRealm(token, options.wallet, true);
      } else {
        throw new Error(
          `Remote asset toggled off ${Object.entries(token).toString()}. Remote assets should never be toggled off. Once toggled on, they become RealmTokens.`,
        );
      }
    }
  };

  const disallowDeselection = isTokenInGallery && tokensGalleryLength === 1;

  return <AssetSwitch token={token} value={isTokenInGallery} onValueChange={handleValueChange} options={{ ...options, readonly: disallowDeselection }} />;
};
