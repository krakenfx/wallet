import Realm from 'realm';

import { showToast } from '@/components/Toast';
import { SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { ReactNavigationDispatch, initWalletConnectWeb3Wallet } from '/modules/wallet-connect';
import { isWalletConnectURI, isWalletConnectURIV1, isWalletConnectURIV2 } from '/modules/wallet-connect/utils';


const validSubmittedQRCodesCache: string[] = [];

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
    if (validSubmittedQRCodesCache.includes(result)) {
      return handleError('Reusing QR code', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_previously_submitted_qr_code });
    }

    try {
      const web3wallet = await initWalletConnectWeb3Wallet(realm, dispatch, getSeed);

      showToast({ type: 'info', text: loc.walletConnect.action_in_progress, duration: 1000 });
      await web3wallet.core.pairing.pair({ uri: result });
      validSubmittedQRCodesCache.push(result);
    } catch (e) {
      return handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  } else {
    return handleError('Invalid URI', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.scan.wallet_connect_invalid_qr_code });
  }
}
