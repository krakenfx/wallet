import { DoubleRow } from '@/components/DoubleRow';
import { TransactionAmount } from '@/components/Transaction';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';

import type { TransactionContent } from '/modules/wallet-connect/types';

type Props = {
  content: TransactionContent;
};

export const AssetContent = ({ content }: Props) => {
  const isSwap = content.type === TRANSACTION_TYPES.SWAP;

  if (isSwap) {
    const [send, receive] = content.assetContent;

    return (
      <DoubleRow
        iconName="swap"
        renderTop={({ containerStyle }) => (
          <TransactionAmount
            assetAmount={send.assetAmount}
            assetFiatAmount={send.assetFiatAmount}
            assetNetwork={send.assetNetwork}
            assetSymbol={send.assetSymbol}
            containerStyle={containerStyle}
          />
        )}
        renderBottom={({ containerStyle }) => (
          <TransactionAmount
            assetAmount={receive.assetAmount}
            assetFiatAmount={receive.assetFiatAmount}
            assetNetwork={receive.assetNetwork}
            assetSymbol={receive.assetSymbol}
            containerStyle={containerStyle}
          />
        )}
      />
    );
  }
  return (
    <>
      {content.assetContent.map(({ assetAmount, assetFiatAmount, assetNetwork, assetSymbol }, i) => {
        return (
          <TransactionAmount
            assetAmount={assetAmount}
            assetFiatAmount={assetFiatAmount}
            assetNetwork={assetNetwork}
            assetSymbol={assetSymbol}
            key={`${i}:${assetNetwork}:${assetSymbol}`}
          />
        );
      })}
    </>
  );
};
