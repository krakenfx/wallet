import { useDepositOptionsCardDataQuery } from '@/reactQuery/hooks/earn/useDepositOptionsQuery';

import { DepositOptionsCarouselUI } from './DepositOptionsCarouselUI';

type Props = { caption?: string };

export const DepositOptionsCarousel = ({ caption }: Props) => {
  const { data: cards, isLoading } = useDepositOptionsCardDataQuery({ minimumBalanceThreshold: 0, maxVaultsPerAsset: 1 });

  return <DepositOptionsCarouselUI caption={caption} cards={cards} isLoading={isLoading} />;
};
