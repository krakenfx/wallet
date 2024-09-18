import { useTokens } from '@/realm/tokens';

export const useTokensGallery = () => {
  const tokensGallery = useTokens().filtered('inGallery == "autoAdded" OR inGallery == "manuallyAdded"');

  return tokensGallery;
};
