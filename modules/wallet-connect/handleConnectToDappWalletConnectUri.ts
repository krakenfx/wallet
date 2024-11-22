import type { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import type Realm from 'realm';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { initWalletConnectWeb3Wallet } from '/modules/wallet-connect';
import { isWalletConnectURI, isWalletConnectURIV1, isWalletConnectURIV2 } from '/modules/wallet-connect/utils';

export async function handleConnectToDappWalletConnectUri(
  result: string = '',
  realm: Realm,
  dispatch: ReactNavigationDispatch,
  getSeed: SecuredKeychainContext['getSeed'],
) {
  if (!result) {
    return handleError('Empty result', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_failed });
  }

  if (!isWalletConnectURI(result)) {
    return handleError('Invalid URI', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_invalid_qr_code });
  }

  if (isWalletConnectURIV1(result)) {
    return handleError('Deprecated version', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_version_deprecated });
  }

  if (isWalletConnectURIV2(result)) {
    try {
      const web3wallet = await initWalletConnectWeb3Wallet(realm, dispatch, getSeed);

      await web3wallet.core.pairing.pair({ uri: result });
    } catch (e) {
      return handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  } else {
    return handleError('Invalid URI', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_invalid_qr_code });
  }
}
