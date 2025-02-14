export const KRAKEN_CONNECT_PERMISSIONS = {
  funds_withdraw: true,
  withdrawal_address_update: true,
  funds_query: true,
  withdrawal_address_add: true,
  funds_add: true,
};

export const KRAKEN_CONNECT_API_SCOPES = [
  'account.fast-api-key:write',
  'account.fast-api-key:funds-withdraw',
  'account.fast-api-key:withdrawal-address-update',
  'account.fast-api-key:funds-query',
  'account.fast-api-key:multiple',
  'account.fast-api-key:withdrawal-address-add',
  'account.fast-api-key:funds-add',
  'account.info:basic',
];
