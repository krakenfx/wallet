import { useEffect, useState } from 'react';

import { isContentTypeSvg, isSvgImage } from '@/utils/isSvgImage';

export const useIsSvgImage = (imageUrl?: string | null, contentType?: string | null) => {
  const [isSvg, setIsSVG] = useState<boolean>();

  useEffect(() => {
    async function checkType() {
      setIsSVG(await isSvgImage(imageUrl));
    }
    if (!contentType) {
      checkType();
    }
  }, [contentType, imageUrl]);

  return contentType ? isContentTypeSvg(contentType) : isSvg;
};
