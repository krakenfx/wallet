import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useTopOpportunityQuery } from '@/reactQuery/hooks/earn/useTopOpportunityQuery';

import { useHandleHeroError } from '../../context/EarnErrorsContext';
import { DefiHighlightHeroContent } from '../DefiHighlightHeroContent/DefiHighlightHeroContent';
import { DefiHighlightHeroError } from '../EarnScreenErroStates/EarnScreenErroStates';
import { HeroSkeleton } from '../EarnScreenSkeleton/EarnScreenSkeleton';

export const DefiHighlightHero = () => {
  const { data, error, isLoading, isPending } = useTopOpportunityQuery({ networkCaipId: ChainAgnostic.NETWORK_ETHEREUM });

  useHandleHeroError(error);

  if (isLoading || isPending) {
    return <HeroSkeleton />;
  }

  if (error || !data) {
    return <DefiHighlightHeroError />;
  }

  return <DefiHighlightHeroContent vault={data} />;
};
