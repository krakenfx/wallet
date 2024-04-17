export const DEFAULT_ACCOUNT_NAME = 'Wallet';
export const DEFAULT_ACCOUNT_NUMBER = 0;
export const getAccountName = (accountNumber: number) => `${DEFAULT_ACCOUNT_NAME} ${String(accountNumber + 1).padStart(2, '0')}`;
