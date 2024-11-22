import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { DoubleRow } from '@/components/DoubleRow';
import {
  TransactionAmount,
  TransactionBroadcastSuccess,
  TransactionHeader,
  TransactionNftPreview,
  TransactionPath,
  TransactionPathBTC,
} from '@/components/Transaction';
import { useAppCurrency } from '@/realm/settings';
import type { RealmWallet } from '@/realm/wallets';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import { AddressAnalysisInfo } from '../components/AddressAnalysisInfo';

import type { AddressAnalysis } from '../hooks/useAddressAnalysis';
import type { Amounts, TransactionParams } from '../types';

import loc from '/loc';

interface PreviewProps {
  wallet: RealmWallet;
  isSuccess: boolean;
  transactionParams: TransactionParams;
  amounts: Amounts | null;
  recipientLabel: string;
  senderLabel: string;
  addressAnalysis?: AddressAnalysis;
}

export const Preview: React.FC<PreviewProps> = ({ isSuccess, transactionParams, wallet, amounts, addressAnalysis, recipientLabel, senderLabel }) => {
  const { currency } = useAppCurrency();

  return (
    <View>
      <View style={[isSuccess && { opacity: 0 }]}>
        <TransactionHeader heading={loc.send.confirmSend} />

        {transactionParams.type === 'nft' ? (
          <TransactionNftPreview nft={transactionParams.nft} />
        ) : wallet.type === 'HDsegwitBech32' ? (
          <DoubleRow
            iconName="chevron-down"
            renderTop={({ containerStyle }) => (
              <TransactionAmount
                tokenIconProps={{ wallet, tokenId: transactionParams.token.assetId, tokenSymbol: transactionParams.token.metadata.symbol }}
                assetAmount={`-${formatTokenAmount(transactionParams.amount, { compact: true, currency })}`}
                assetFiatAmount={amounts?.amountFiat ? `-${amounts.amountFiat}` : undefined}
                assetNetwork={wallet.type}
                assetSymbol={transactionParams.token.metadata.symbol}
                containerStyle={containerStyle}
              />
            )}
            renderBottom={({ containerStyle }) => <TransactionPathBTC to={recipientLabel} containerStyle={containerStyle} />}
          />
        ) : (
          <>
            <TransactionAmount
              tokenIconProps={{ wallet, tokenId: transactionParams.token.assetId, tokenSymbol: transactionParams.token.metadata.symbol }}
              assetAmount={`-${formatTokenAmount(transactionParams.amount, { compact: true, currency })}`}
              assetFiatAmount={amounts?.amountFiat ? `-${amounts.amountFiat}` : undefined}
              assetNetwork={wallet.type}
              assetSymbol={transactionParams.token.metadata.symbol}
            />
            <TransactionPath from={senderLabel} to={recipientLabel} />
          </>
        )}

        {addressAnalysis?.result?.warning?.severity === 'CRITICAL' && (
          <AddressAnalysisInfo animated={false} addressAnalysis={addressAnalysis} style={styles.addressAnalysisInfo} />
        )}
      </View>
      {isSuccess && <TransactionBroadcastSuccess />}
    </View>
  );
};

const styles = StyleSheet.create({
  addressAnalysisInfo: {
    marginTop: 8,
  },
});
