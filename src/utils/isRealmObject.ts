export const isRealmObject = (item: object): item is Realm.Object => 'isValid' in item;
