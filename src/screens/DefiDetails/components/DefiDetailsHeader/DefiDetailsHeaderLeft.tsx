import { CoinHeaderSimple } from '@/components/CoinHeader';

import type { WalletType } from '@/onChain/wallets/registry';

type Props = { assetAddress: string; assetName: string; assetNetwork: WalletType; assetSymbol: string };

export const DefiDetailsHeaderLeft = ({ assetAddress, assetName, assetNetwork, assetSymbol }: Props) => {
  return <CoinHeaderSimple tokenAddress={assetAddress} tokenName={assetName} tokenNetwork={assetNetwork} tokenSymbol={assetSymbol} />;
};
