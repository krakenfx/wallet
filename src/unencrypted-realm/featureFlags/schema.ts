import type { ObjectSchema } from 'realm';

export const NEW_NON_EVM_NETWORKS = [] as const;
export const NEW_EVM_NETWORKS = [] as const;
export const NEW_NETWORKS = [...NEW_EVM_NETWORKS, ...NEW_NON_EVM_NETWORKS] as const;

export const RealmFeatureFlag = {
  earnEnabled: 'earnEnabled',
  krakenConnectEnabled: 'krakenConnectEnabled',
  NewNetworksEnabled: 'NewNetworksEnabled',
  assetIconsV2Enabled: 'assetIconsV2Enabled',
} as const;

export type FeatureFlags = Record<keyof typeof RealmFeatureFlag, boolean>;

export const REALM_TYPE_FEATURE_FLAGS = 'FeatureFlags';

export const FeatureFlagsSchema: ObjectSchema = {
  name: REALM_TYPE_FEATURE_FLAGS,
  properties: {
    name: 'string',
    value: 'bool',
  },
  primaryKey: 'name',
};

export type FeatureFlag = {
  name: keyof FeatureFlags;
  value: FeatureFlags[keyof FeatureFlags];
};

export type RealmFeatureFlags = RealmTypeOf<FeatureFlag>;
