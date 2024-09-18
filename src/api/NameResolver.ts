import { Network } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';

import { getHarmony } from './base/apiFactory';

export default class NameResolver {
  static RESOLVED_NAME_NONE = 'RESOLVED_NAME_NONE';

  static isEnsName(name: string): boolean {
    return name.toLowerCase().endsWith('.eth');
  }

  protected network: Network | undefined;

  constructor(_network: Network | undefined) {
    this.network = _network;
  }

  isNetworkSupported() {
    return this.network instanceof EVMNetwork;
  }

  isValidName(name: string) {
    if (this.network instanceof EVMNetwork) {
      return NameResolver.isEnsName(name);
    }
    return false;
  }

  async resolveName(name: string): Promise<string> {
    if (!(this.network instanceof EVMNetwork)) {
      throw new Error("Can't resolve for this wallet");
    }
    const api = await getHarmony();

    const { content } = await api.GET('/v1/resolveName', { params: { query: { name, network: this.network.caipId } } });

    if (content?.address) {
      return content.address;
    }
    throw NameResolver.RESOLVED_NAME_NONE;
  }

  async resolveAddress(address: string): Promise<string> {
    if (!(this.network instanceof EVMNetwork)) {
      throw new Error("Can't resolve for this wallet");
    }
    const api = await getHarmony();
    const { content } = await api.GET('/v1/resolveAddressLabels', { params: { query: { addresses: [address], network: this.network.caipId } } });
    if (!content?.length) {
      throw Error("Can't resolve this address");
    } else {
      return content[0]?.name ?? '';
    }
  }

  isSuspicious(name: string) {
    
    const spl = name.split('.');
    const namejoined = spl.slice(0, spl.length - 1).join('');

    
    const isPrintableASCII = (string: string) => /^[\x20-\x7F]*$/.test(string);

    let theresPrintable = false;
    let theresNonPrintable = false;

    for (const char of namejoined.split('')) {
      if (isPrintableASCII(char)) {
        theresPrintable = true;
      } else {
        theresNonPrintable = true;
      }
    }

    if (theresPrintable && theresNonPrintable) {
      
      return true;
    }

    return false;
  }
}
