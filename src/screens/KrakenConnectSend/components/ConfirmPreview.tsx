import { StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { TransactionAmount, TransactionBroadcastSuccess, TransactionHeader } from '@/components/Transaction';
import type { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings';
import { getkBtcAssetId } from '@/screens/KrakenConnectSend/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import { TransactionPathFromKrakenToWallet } from './TransactionPathFromKrakenToWallet';

import loc from '/loc';

interface Props {
  asset: KrakenAssetSupported;
  amountFiat: string;
  amount: string;
  network: WalletType;
  isSuccess?: boolean;
  isKBTC?: boolean;
}

export const ConfirmPreview = ({ asset, network, amountFiat, amount, isSuccess, isKBTC }: Props) => {
  const { currency } = useAppCurrency();
  const kBTCProps = isKBTC
    ? {
        tokenIconProps: { tokenId: getkBtcAssetId(network) },
      }
    : {};

  return (
    <>
      <View style={[isSuccess && styles.hide]}>
        <TransactionHeader heading={loc.krakenConnect.transfer.confirm} />
        <TransactionAmount
          assetAmount={formatTokenAmount(amount, { compact: true, currency })}
          assetFiatAmount={formatCurrency(amountFiat, { currency })}
          assetNetwork={network}
          assetSymbol={asset.symbol}
          {...kBTCProps}
        />
        <TransactionPathFromKrakenToWallet />
      </View>
      {isSuccess && <TransactionBroadcastSuccess />}
    </>
  );
};

const styles = StyleSheet.create({
  hide: { opacity: 0 },
});
