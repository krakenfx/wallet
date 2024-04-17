import BigNumber from 'bignumber.js';

export class SuperBigNumber extends BigNumber {
  constructor(n: BigNumber.Value | bigint, base?: number) {
    if (typeof n === 'object' && 'hex' in n && n.hex) {
      super(n.hex, base);
      return;
    }

    if (typeof n === 'object' && '_hex' in n && n._hex) {
      super(n._hex, base);
      return;
    }

    if (typeof n === 'string' && new BigNumber(n).isNaN() && !new BigNumber('0x' + n).isNaN()) {
      super('0x' + n, base);
      return;
    }

    if (typeof n === 'bigint') {
      super(n.toString(base), base);
      return;
    }

    super(n, base);
  }
}
