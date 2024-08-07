import Realm from 'realm';

import {
  migrationsSchemaVersion18,
  migrationsSchemaVersion19,
  migrationsSchemaVersion20,
  migrationsSchemaVersion23,
  migrationsSchemaVersion25,
  migrationsSchemaVersion26,
  migrationsSchemaVersion27,
} from './';

export const onMigration = (oldRealm: Realm, newRealm: Realm) => {
  migrationsSchemaVersion18(oldRealm, newRealm);
  migrationsSchemaVersion19(oldRealm, newRealm);
  migrationsSchemaVersion20(oldRealm, newRealm);
  migrationsSchemaVersion23(oldRealm, newRealm);
  migrationsSchemaVersion25(oldRealm, newRealm);
  migrationsSchemaVersion26(oldRealm, newRealm);
  migrationsSchemaVersion27(oldRealm, newRealm);
};
