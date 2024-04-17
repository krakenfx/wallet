import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';

import { RealmNft } from './schema';
import { useNftsMutations } from './useNftsMutations';

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
