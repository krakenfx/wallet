import type React from 'react';

import { StyleSheet, View } from 'react-native';

import type { KrakenAssetSupported, KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import { ActivityIndicator } from '@/components/ActivityIndicator';
import { AddressDisplay } from '@/components/AddressDisplay';
import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { TransactionDetailItem } from '@/components/Transaction';
import type { WalletType } from '@/onChain/wallets/registry';

import { useCurrentAccount } from '@/realm/accounts/useCurrentAccount';
import { useAppCurrency } from '@/realm/settings';
import { formatCurrency } from '@/utils/formatCurrency';

import { getWalletNetworkByNetworkId } from '../utils';

import loc from '/loc';

interface DetailsProps {
  asset: KrakenAssetSupported;
  amount: string;
  amountFiat: string;
  address: string;
  fee: string;
  withdrawMethod: KrakenWithdrawMethod;
  isLoading?: boolean;
}

export const ConfirmDetails: React.FC<DetailsProps> = ({ amount, asset, address, amountFiat, fee, withdrawMethod, isLoading }) => {
  const network = getWalletNetworkByNetworkId(withdrawMethod.network_id);
  const { currency } = useAppCurrency();
  const { accountCustomName } = useCurrentAccount();

  const networkIconName = network?.type;
  const label = withdrawMethod.network;
  const formattedFiatValue = formatCurrency(amountFiat, { currency });

  return (
    <View style={styles.detailsContainer}>
      <TransactionDetailItem title={loc.transactionDetails.amount}>
        <Label>
          {`${amount} ${asset.symbol} `}
          <Label type="regularMonospace" color="light75">
            -{formattedFiatValue}
          </Label>
        </Label>
      </TransactionDetailItem>

      <TransactionDetailItem title={loc.krakenConnect.transfer.transferringTo}>
        <Label type="boldBody">{accountCustomName}</Label>
        {isLoading ? <ActivityIndicator /> : <AddressDisplay address={address} hasSpaces boldPrefix />}
      </TransactionDetailItem>

      <TransactionDetailItem title={loc.krakenConnect.transfer.transferFee}>
        <View style={styles.label}>{!isLoading && <Label>{fee}</Label>}</View>
      </TransactionDetailItem>
      <TransactionDetailItem title={loc.krakenConnect.transfer.network}>
        <View style={styles.label}>
          <NetworkIcon networkName={networkIconName as WalletType} size={16} />
          <Label>{label}</Label>
        </View>
      </TransactionDetailItem>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 8,
    marginHorizontal: 12,
  },
  label: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
