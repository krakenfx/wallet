import { z } from 'zod';

import { fromHex } from './utils';

export const solSignMessageParamsSchema = z.tuple([z.string().min(1).transform(fromHex), z.literal('utf8')]);

export const solSignTransactionsParamsSchema = z.array(z.tuple([z.string().min(1).transform(fromHex), z.boolean()])).min(1);

export type SolSignTransactionParams = z.infer<typeof solSignTransactionsParamsSchema>;

export const evmWalletSwitchEthereumChainSchema = z.tuple([
  z.object({
    chainId: z.string().regex(/^0x[0-9a-f]+$/i),
  }),
]);

export const evmWalletRequestPermissionsSchema = z.tuple([z.record(z.record(z.unknown()))]);
