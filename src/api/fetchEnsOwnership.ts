import { compact } from 'lodash';

import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';

import { getHarmony } from './base/apiFactory';

import type { ResolvedAddressLabels } from './types';

export async function fetchEnsOwnership(name: string) {
  const harmony = await getHarmony();
  const response = await harmony.GET('/v1/resolveName', {
    params: {
      query: {
        name,
        network: ethereumNetwork.caipId,
      },
    },
  });

  if (!response.content) {
    return null;
  }

  const content = response.content;

  
  if (content.manager === content.address && content.owner === content.address) {
    const data = {
      name,
      address: content.address,
      avatar: content.avatar,
    };
    return {
      owner: data,
      manager: data,
    };
  }

  const isOwnerEnsName = typeof content.owner === 'string' && content.owner.endsWith('.eth');
  const addressList = compact(isOwnerEnsName ? [content.manager] : [content.owner, content.manager]);

  const resolvedAddresses: ResolvedAddressLabels[] = (
    await harmony.GET('/v1/resolveAddressLabels', {
      params: {
        query: {
          addresses: addressList,
          network: ethereumNetwork.caipId,
        },
      },
    })
  ).content;

  const roleNameMap = isOwnerEnsName
    ? {
        owner: content.owner,
        manager: resolvedAddresses[0]?.name,
      }
    : {
        owner: resolvedAddresses[0]?.name,
        manager: resolvedAddresses[1]?.name,
      };

  const avatars = await Promise.all(
    resolvedAddresses.map(async data => {
      if (data?.name) {
        const res = await harmony.GET('/v1/resolveName', { params: { query: { name: data.name, network: ethereumNetwork.caipId } } });
        return res.content?.avatar;
      }
    }),
  );

  const roleAvatarMap = isOwnerEnsName
    ? {
        owner: content.avatar,
        manager: avatars[0],
      }
    : {
        owner: avatars[0],
        manager: avatars[1],
      };

  return {
    owner: {
      address: content.owner || undefined,
      name: roleNameMap.owner,
      avatar: roleAvatarMap.owner,
    },
    manager: {
      address: content.manager || undefined,
      name: roleNameMap.manager,
      avatar: roleAvatarMap.manager,
    },
  };
}
