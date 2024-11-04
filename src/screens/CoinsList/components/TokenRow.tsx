import React from 'react';

import { AssetSwitch } from '@/components/AssetSwitch';
import { ReputationTag } from '@/components/Reputation';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import { useTokenSwitch } from '@/hooks/useTokenSwitch';
import type { RealmToken } from '@/realm/tokens';

interface TokenRowProps {
  token: RealmToken;
  tokensGalleryLength: number;
}

export const TokenRow: React.FC<TokenRowProps> = ({ token, tokensGalleryLength }) => {
  const reputation = useReputation(token.assetId);
  const { shouldRender, isTokenInGallery, disallowDeselection, onSwitch } = useTokenSwitch({
    token,
    tokensGalleryLength,
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <AssetSwitch
      token={token}
      value={isTokenInGallery}
      onValueChange={onSwitch}
      options={{
        hideZeroAmount: true,
        showAmountInFiat: false,
        symbolUnderLabel: true,
        tag: (
          <ReputationTag assetId={token.assetId} reputation={reputation} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />
        ),
        walletId: token.walletId,
        readonly: disallowDeselection,
      }}
    />
  );
};
