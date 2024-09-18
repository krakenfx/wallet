import { keyBy, zipObject } from 'lodash';

import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';

import { getHarmony } from './base/apiFactory';

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

  const roles = ['owner', 'manager'] as const;

  const roleAddressList = roles.map(role => response.content?.[role]).filter(Boolean) as string[];

  const roleNameList = (
    await harmony.GET('/v1/resolveAddressLabels', {
      params: {
        query: {
          addresses: roleAddressList,
          network: ethereumNetwork.caipId,
        },
      },
    })
  ).content;

  const roleNameMap = zipObject(roles, roleNameList);

  const avatars = await Promise.all(
    roleNameList
      .filter(data => Boolean(data?.name))
      .map((data, i) => ({ name: data!.name, role: roles[i] }))
      .map(data =>
        harmony.GET('/v1/resolveName', { params: { query: { name: data.name, network: ethereumNetwork.caipId } } }).then(res => ({
          role: data.role,
          avatar: res.content?.avatar,
        })),
      ),
  );

  const roleAvatarMap = keyBy(avatars, 'role');

  return {
    owner: {
      address: response.content?.owner || undefined,
      name: roleNameMap.owner?.name,
      avatar: roleAvatarMap.owner?.avatar,
    },
    manager: {
      address: response.content?.manager || undefined,
      name: roleNameMap.manager?.name,
      avatar: roleAvatarMap.manager?.avatar,
    },
  };
}
