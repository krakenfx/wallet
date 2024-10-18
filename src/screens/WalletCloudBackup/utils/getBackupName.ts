import { formatPasskeyDate } from '@/utils/dateFormatter';

export const getBackupName = (date: Date, locale: Locale) => `Kraken Wallet - ${formatPasskeyDate(date, locale)}`;
