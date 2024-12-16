import {
  migrationsSchemaVersion18,
  migrationsSchemaVersion19,
  migrationsSchemaVersion20,
  migrationsSchemaVersion23,
  migrationsSchemaVersion25,
  migrationsSchemaVersion26,
  migrationsSchemaVersion27,
  migrationsSchemaVersion29,
  migrationsSchemaVersion31,
  migrationsSchemaVersion33,
  migrationsSchemaVersion35,
  migrationsSchemaVersion36,
  migrationsSchemaVersion37,
  migrationsSchemaVersion38,
} from './';

import type Realm from 'realm';

export const onMigration = (oldRealm: Realm, newRealm: Realm) => {
  migrationsSchemaVersion18(oldRealm, newRealm);
  migrationsSchemaVersion19(oldRealm, newRealm);
  migrationsSchemaVersion20(oldRealm, newRealm);
  migrationsSchemaVersion23(oldRealm, newRealm);
  migrationsSchemaVersion25(oldRealm, newRealm);
  migrationsSchemaVersion26(oldRealm, newRealm);
  migrationsSchemaVersion27(oldRealm, newRealm);
  migrationsSchemaVersion29(oldRealm, newRealm);
  migrationsSchemaVersion31(oldRealm, newRealm);
  migrationsSchemaVersion33(oldRealm, newRealm);
  migrationsSchemaVersion35(oldRealm, newRealm);
  migrationsSchemaVersion36(oldRealm, newRealm);
  migrationsSchemaVersion37(oldRealm, newRealm);
  migrationsSchemaVersion38(oldRealm, newRealm);
};
