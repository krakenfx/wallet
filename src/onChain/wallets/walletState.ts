import Realm from 'realm';

import type { WalletAddressCacheItem, WalletState } from '@/realm/wallets';
import { REALM_TYPE_WALLET_ADDRESS_CACHE, REALM_TYPE_WALLET_STATE } from '@/realm/wallets';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { NotSupportedError } from './base';
import { getImplForWallet } from './registry';

import type { RealmishWallet } from './base';

export interface IWalletStorage<T> {
  state: T;
  getAddress(derivationPath: string, creatorFunc: () => Promise<string>): Promise<string>;
}

export class WalletStorage<T> implements IWalletStorage<T> {
  constructor(
    private realm: Realm,
    public state: T,
    private walletId: string,
  ) {}

  async getAddress(derivationPath: string, creatorFunc: () => Promise<string>): Promise<string> {
    const cacheItem = this.realm
      .objects<WalletAddressCacheItem>(REALM_TYPE_WALLET_ADDRESS_CACHE)
      .filtered(`walletId = "${this.walletId}" && key = "${derivationPath}"`)?.[0];
    if (cacheItem) {
      return cacheItem.address;
    }

    const address = await runAfterUISync(creatorFunc);
    this.realm.write(() => {
      this.realm.create<WalletAddressCacheItem>(REALM_TYPE_WALLET_ADDRESS_CACHE, {
        walletId: this.walletId,
        key: derivationPath,
        address,
      });
    });
    return address;
  }
}

export async function getWalletStorage<T>(realm: Realm, wallet: RealmishWallet, shouldRefresh?: boolean): Promise<IWalletStorage<T>> {
  const walletStateString = realm.objectForPrimaryKey<WalletState>(REALM_TYPE_WALLET_STATE, wallet.id)?.serialized;
  const walletState = walletStateString ? JSON.parse(walletStateString) : undefined;

  const storageInterface = new WalletStorage<T>(realm, walletState, wallet.id);

  if (shouldRefresh) {
    await refreshWalletState(wallet, realm, storageInterface);
  }

  return storageInterface;
}

export async function refreshWalletState<T>(wallet: RealmishWallet, realm: Realm, store: WalletStorage<T>): Promise<void> {
  let newState: T;
  try {
    const { network, transport } = getImplForWallet(wallet);
    newState = (await transport.fetchState?.(wallet, network, store)) as T;
  } catch (e) {
    if (e instanceof NotSupportedError) {
      return;
    }
    throw e;
  }

  realm.write(() => {
    realm.create<WalletState>(
      REALM_TYPE_WALLET_STATE,
      {
        id: wallet.id,
        serialized: JSON.stringify(newState),
      },
      Realm.UpdateMode.Modified,
    );
  });

  store.state = newState;
}
