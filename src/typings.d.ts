import type { LocalizedStringsMethods } from 'react-localization';

import type { Simplify } from 'type-fest';

declare global {
  type LocalizedString = ReturnType<LocalizedStringsMethods['formatString']>;
  declare module '*.png';
  declare const _brand: unique symbol;
  type Branded<T, Name> = T & { [_brand]: Name };

  
  type MapArrayPropertiesToRealmList<T> = {
    [K in keyof T]: T[K] extends (infer G)[] ? Realm.List<RealmTypeOf<G>> : T[K];
  };

  type MaybeNull<T> = undefined extends T ? T | null : T;

  type MaybeNullish<T> = undefined extends T ? T | null | undefined : T;

  
  type MapOptionalNull<T> = {
    [K in keyof T]-?: MaybeNull<T[K]>;
  };

  
  type RealmTypeOfNested<T> = T extends object
    ? Realm.Object & MapArrayPropertiesToRealmList<MapOptionalNull<T>>
    : T extends Array<infer G>
      ? G extends object
        ? Realm.List<RealmTypeOf<G>>
        : Realm.List<G>
      : T;

  
  type RealmTypeOf<T, LinkedProps = object> = Simplify<Omit<RealmTypeOfNested<T> & LinkedProps, 'toJSON'> & { toJSON: () => T }>;

  
  type MapArrayPropertiesToRealmishArray<T> = {
    [K in keyof T]: T[K] extends Array<infer G> ? Realm.List<RealmTypeOf<G>> | Array<G> : MaybeNullish<T[K]>;
  };

  
  type Realmish<T> = MapArrayPropertiesToRealmishArray<T>;

  
  type RealmResults<T> = Realm.Results<T & Realm.Object<T>>;

  declare interface Error {
    code?: string;
  }
}

export {};
