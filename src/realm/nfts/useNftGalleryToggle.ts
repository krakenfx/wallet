import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';

import { useNftsMutations } from './useNftsMutations';

import type { RealmNft } from './schema';

export const useNftGalleryToggle = (nft: RealmNft) => {
  const { toggleNftInGallery } = useNftsMutations();

  const [isInGallery, setInGallery] = useLocalStateUpdate<boolean>(!!nft.inGallery, () => {
    toggleNftInGallery(nft);
  });

  const toggleGallery = () => {
    setInGallery(!isInGallery);
  };

  return { toggleGallery, isInGallery };
};
