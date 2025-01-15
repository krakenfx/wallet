import type { SubWallet } from '../OnboardingImportSubWalletsScreen.types';

export const fetchSubWalletByAccountCache: Record<string, SubWallet | null> = {};
