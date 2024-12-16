import { FeatureFlagsSchema } from '@/unencrypted-realm/featureFlags/schema';
import { onMigration } from '@/unencrypted-realm/migrations/onMigration';

import type { Configuration } from 'realm';

export const RealmSchema = [FeatureFlagsSchema];

export const realmConfig: Configuration = {
  path: 'unencrypted.realm',
  schemaVersion: 1,
  schema: RealmSchema,
  onMigration,
};
