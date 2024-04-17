import { useTokens } from '@/realm/tokens';

export const useTokensGallery = () => {
  const tokensGallery = useTokens().filtered('inGallery == true');

  return tokensGallery;
};
