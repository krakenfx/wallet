import Realm from 'realm';

import { makeWalletId } from '@/onChain/wallets/base';
import { WalletType, getImplForType } from '@/onChain/wallets/registry';
import { REALM_TYPE_ASSET_METADATA, RealmAssetMetadata } from '@/realm/assetMetadata';

import { REALM_TYPE_ACCOUNT, RealmAccount } from '../accounts';
import { REALM_TYPE_TOKEN, RealmToken } from '../tokens/schema';
import { REALM_TYPE_WALLET, RealmWallet } from '../wallets/schema';

export const migrationsSchemaVersion23 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 23) {
    const type: WalletType = 'blast';
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
