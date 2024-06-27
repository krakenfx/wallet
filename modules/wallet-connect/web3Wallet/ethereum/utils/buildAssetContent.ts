import { fetchPriceForToken } from '@/api/fetchPriceForToken';
import { fetchTokenMetadata } from '@/api/fetchTokenMetadata';
import { TransactionAmountProps } from '@/components/Transaction/TransactionAmount';
import { Network } from '@/onChain/wallets/base';
import { WalletType } from '@/onChain/wallets/registry';
import { TransactionData } from '@/realm/transactions/getTransactionMetadata';
import { Currency } from '@/screens/Settings/currency';
import { formatTransactionValueAsNegativeOrPositive } from '@/screens/Transactions/utils/formatTransactionValueAsNegativeOrPositive';
import { calculateBalance } from '@/utils/calculateBalance';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { getNetworkName } from '../../../utils';

import { handleError } from '/helpers/errorHandler';

export async function buildAssetContent(data: TransactionData, network: Network, currency: Currency): Promise<TransactionAmountProps[]> {
  let assetContentItems: { assetId: string; tokenAmount: string }[];
  if (data.kind === 'swap') {
    assetContentItems = [
      { assetId: data.sent.assetId, tokenAmount: formatTransactionValueAsNegativeOrPositive(data.sent.amount, data.type, { isSwapSent: true }) },
      { assetId: data.receive.assetId, tokenAmount: formatTransactionValueAsNegativeOrPositive(data.receive.amount, data.type) },
    ];
  } else if (data.kind === 'simple') {
    assetContentItems = [{ assetId: data.effect.assetId, tokenAmount: formatTransactionValueAsNegativeOrPositive(data.effect.amount, data.type) }];
  } else if (data.kind === 'nft') {
    assetContentItems = [];
  } else if (data.kind === 'contract') {
    assetContentItems = [];
  } else {
    const exhaustiveCheck: never = data;
    throw new Error(`Unhandled case: ${exhaustiveCheck}`);
  }

  const assetContent: TransactionAmountProps[] = await Promise.all(
    assetContentItems.map(async ({ assetId, tokenAmount }) => {
      const assetContentItem = await buildAssetContentItem({ assetId, network, tokenAmount, currency });
      return assetContentItem;
    }),
  ).catch(error => {
    handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    return [];
  });

  return assetContent;
}

const buildAssetContentItem = async ({
  assetId,
  network,
  tokenAmount,
  currency,
}: {
  assetId: string;
  network: Network;
  tokenAmount: string;
  currency: Currency;
}): Promise<TransactionAmountProps> => {
  const tokenMetadata = await fetchTokenMetadata(assetId);

  const assetAmount = !tokenAmount ? '0.00' : tokenAmount;
  const assetAmountInTokenUnit = smallUnit2TokenUnit(assetAmount, tokenMetadata.decimals).toString(10);
  const assetAmountFormatted = formatTokenAmount(assetAmountInTokenUnit, { compact: true, currency });
  const { fiatValue } = await fetchPriceForToken(assetId);

  const appCurrencyExchangeRate = fiatValue ? parseFloat(fiatValue[currency].value ?? '0') : 0;
  const assetAmountInAppCurrency = (calculateBalance({ decimals: tokenMetadata.decimals, price: appCurrencyExchangeRate, balance: assetAmount }) ?? '0') + '';
  const assetAmountInAppCurrencyFormatted =
    assetAmountInAppCurrency === '0' ? formatCurrency(0, { currency }) : formatCurrency(assetAmountInAppCurrency, { currency });

  return {
    assetAmount: assetAmountFormatted,
    assetFiatAmount: assetAmountInAppCurrencyFormatted,

    assetNetwork: getNetworkName(network.caipId) as WalletType,
    assetSymbol: tokenMetadata?.symbol ?? '',
  };
};
