import { getHarmony } from './base/apiFactory';
import { DeFiProtocol } from './types';

export type DefiPositionsResponse = {
  fiatRates: { [iso: string]: string };
  positions: DeFiProtocol[];
};

export async function fetchDefiPositions(address: string): Promise<DefiPositionsResponse> {
  const harmony = await getHarmony();
  const { content } = await harmony.GET('/v2/positions', { params: { query: { address } } });

  return content;
}
