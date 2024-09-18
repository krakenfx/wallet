
export function realmListToFlashListData<T>(data?: ReadonlyArray<T> | null) {
  return data?.slice(0);
}
