import type { RealmToken } from '@/realm/tokens';
import { isTokenInGallery as isTokenInGalleryCheck, useTokensMutations } from '@/realm/tokens';
import { useTokensGalleryMutations } from '@/realm/tokensGallery';
import type { RealmWallet } from '@/realm/wallets';
import type { RemoteAsset } from '@/types';
import { isRealmObject } from '@/utils/isRealmObject';
import { isRealmToken } from '@/utils/isRealmToken';

type UseTokenSwitchProps = {
  token: RealmToken | RemoteAsset;
  tokensGalleryLength: number;
  options?: {
    isRemoteAsset?: boolean;
    wallet?: RealmWallet;
  };
};

export const useTokenSwitch = ({ token, tokensGalleryLength, options = {} }: UseTokenSwitchProps) => {
  const { addTokenToRealm, removeTokenFromRealm } = useTokensMutations();
  const { removeTokenFromGallery, addTokenToGallery } = useTokensGalleryMutations();

  
  const isInvalidRealmToken = isRealmObject(token) && !token.isValid();
  const isTokenInGallery = isRealmToken(token) && token.isValid() && isTokenInGalleryCheck(token.inGallery);
  const disallowDeselection = isTokenInGallery && tokensGalleryLength === 1;

  const onSwitch = (value: boolean, walletId?: string) => {
    if (isRealmToken(token)) {
      
      if (!value && walletId && token.assetId !== token.wallet.nativeTokenCaipId && token.balance === '0') {
        removeTokenFromRealm(walletId, token.assetId);
        
        return;
      }

      
      if (isTokenInGalleryCheck(token.inGallery)) {
        removeTokenFromGallery(token);
      } else {
        addTokenToGallery(token);
      }

      return;
    }

    if (!options.isRemoteAsset) {
      return;
    }

    
    if (value && options?.wallet) {
      addTokenToRealm(token, options?.wallet);
      return;
    }

    
    throw new Error(
      `Remote asset toggled off ${Object.entries(token).toString()}. Remote assets should never be toggled off. Once toggled on, they become RealmTokens.`,
    );
  };

  return {
    shouldRender: !isInvalidRealmToken,
    isTokenInGallery,
    disallowDeselection,
    onSwitch,
  };
};
