import Realm from 'realm';

import { makeWalletId } from '@/onChain/wallets/base';
import type { WalletType } from '@/onChain/wallets/registry';
import { getImplForType } from '@/onChain/wallets/registry';
import type { RealmAssetMetadata } from '@/realm/assetMetadata';
import { REALM_TYPE_ASSET_METADATA } from '@/realm/assetMetadata';

import { REALM_TYPE_ACCOUNT } from '../accounts';
import { REALM_TYPE_DEFI } from '../defi';
import { REALM_TYPE_NFT } from '../nfts';
import { REALM_TYPE_SETTINGS, RealmSettingsKey } from '../settings';
import { REALM_TYPE_TOKEN } from '../tokens';
import { REALM_TYPE_WALLET_TRANSACTION } from '../transactions';
import { REALM_TYPE_WALLET } from '../wallets';

import type { RealmAccount } from '../accounts';
import type { RealmSettings } from '../settings';
import type { RealmToken } from '../tokens';
import type { RealmWallet } from '../wallets';

export const migrationsSchemaVersion39 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 39) {
    const testnetEnabled = newRealm.objectForPrimaryKey<RealmSettings>(REALM_TYPE_SETTINGS, RealmSettingsKey.isTestnetEnabled);
    if (!testnetEnabled?.value) {
      const inkSepoliaType: WalletType = 'inkSepolia';

      const tokensToDelete = newRealm.objects(REALM_TYPE_TOKEN).filtered(`wallet.type = '${inkSepoliaType}'`);
      newRealm.delete(tokensToDelete);
      const defiToDelete = newRealm.objects(REALM_TYPE_DEFI).filtered(`wallet.type = '${inkSepoliaType}'`);
      newRealm.delete(defiToDelete);
      const nftsToDelete = newRealm.objects(REALM_TYPE_NFT).filtered(`wallet.type = '${inkSepoliaType}'`);
      newRealm.delete(nftsToDelete);
      const transactionsToDelete = newRealm.objects(REALM_TYPE_WALLET_TRANSACTION).filtered(`wallet.type = '${inkSepoliaType}'`);
      newRealm.delete(transactionsToDelete);

      const walletsToDelete = newRealm.objects(REALM_TYPE_WALLET).filtered(`type = '${inkSepoliaType}'`);
      newRealm.delete(walletsToDelete);
    }

    const type: WalletType = 'ink';
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
