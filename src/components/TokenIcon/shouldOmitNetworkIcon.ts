import { omitNetworkIcons } from './constants';

import type { TokenIconProps } from './TokenIconProps';

export const shouldOmitNetworkIcon = ({
  networkName,
  tokenId,
  tokenSymbol,
  wallet,
  forceOmitNetworkIcon,
  forceNetworkIcon,
}: TokenIconProps): boolean | undefined => {
  const isOnlyNetworkProvided = !!networkName && !tokenId && !tokenSymbol;
  const isInOmitNetworkIcons = wallet && wallet.type === omitNetworkIcons[tokenId ?? ''];

  return !forceNetworkIcon && (isOnlyNetworkProvided || isInOmitNetworkIcons || forceOmitNetworkIcon);
};
