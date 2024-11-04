import Realm from 'realm';

import { makeWalletId } from '@/onChain/wallets/base';
import type { WalletType } from '@/onChain/wallets/registry';
import { getImplForType } from '@/onChain/wallets/registry';
import type { RealmAssetMetadata } from '@/realm/assetMetadata';
import { REALM_TYPE_ASSET_METADATA } from '@/realm/assetMetadata';

import { REALM_TYPE_ACCOUNT } from '../accounts';

import { REALM_TYPE_TOKEN } from '../tokens/schema';

import { REALM_TYPE_WALLET } from '../wallets/schema';

import type { RealmAccount } from '../accounts';
import type { RealmToken } from '../tokens/schema';

import type { RealmWallet } from '../wallets/schema';


export const migrationsSchemaVersion33 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 33) {
    const type: WalletType = 'avalanche';
    const { network } = getImplForType(type);
    const accounts = newRealm.objects<RealmAccount>(REALM_TYPE_ACCOUNT);

    for (const account of accounts) {
      const accountIdx = account.accountNumber;
      
      const ethWallet = newRealm.objects<RealmWallet>(REALM_TYPE_WALLET).filtered(`type == 'ethereum' && accountIdx == ${accountIdx}`)[0];
      const walletId = makeWalletId({ type, accountIdx });
      const wallet = newRealm.create<RealmWallet>(REALM_TYPE_WALLET, {
        id: walletId,
        type,
        accountIdx,
        caipId: network.caipId,
        nativeTokenSymbol: network.nativeTokenSymbol,
        nativeTokenCaipId: network.nativeTokenCaipId,
        nativeTokenDecimals: network.nativeTokenDecimals,
        nativeTokenLabel: network.nativeTokenLabel,
        extendedPublicKey: ethWallet.extendedPublicKey,
      });
      account.wallets.push(wallet);
      
      newRealm.create<RealmToken>(REALM_TYPE_TOKEN, {
        id: `${wallet.id}:${wallet.nativeTokenCaipId}`,
        assetId: network.nativeTokenCaipId,
        walletId: wallet.id,
        balance: '0',
        wallet,
        metadata: newRealm.create<RealmAssetMetadata>(
          REALM_TYPE_ASSET_METADATA,
          {
            assetId: wallet.nativeTokenCaipId,
            symbol: wallet.nativeTokenSymbol,
            label: network.nativeTokenLabel,
            decimals: wallet.nativeTokenDecimals,
          },
          Realm.UpdateMode.Modified,
        ),
      });
    }
  }
};
