import type React from 'react';

import { AssetRow } from '@/components/AssetRow';
import { ReputationTag } from '@/components/Reputation';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import type { RealmToken } from '@/realm/tokens';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';

interface TokenRowProps {
  token: RealmToken;
  navigation: NavigationProps<'Home'>['navigation'];
}

export const TokenRow: React.FC<TokenRowProps> = ({ token, navigation }) => {
  const reputation = useReputation(token.assetId);

  const options = {
    onPress: () => navigation.navigate(Routes.Transactions, { assetBalanceId: { assetId: token.assetId, walletId: token.walletId } }),
    priceChange: true,
    showAmountInFiat: true,
    tag: <ReputationTag assetId={token.assetId} reputation={reputation} filterOut={{ reputation: [REPUTATION.WHITELISTED], coinDesignation: ['network'] }} />,
    testID: `Asset-${token.assetId}`,
    walletId: token.walletId,
  };

  return <AssetRow token={token} options={options} />;
};
