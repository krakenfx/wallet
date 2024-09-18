
export default class CompactSize {
  size: number;
  offset: number;

  constructor(size: number, offset: number) {
    this.size = size;
    this.offset = offset;
  }

  static fromBuffer(data: Buffer, _offset: number) {
    const firstByte = data.slice(_offset, _offset + 1);

    if (firstByte.length < 1) {
      throw new Error('Cannot read first byte because too small');
    }

    let offset = _offset + 1;
    let size;

    switch (firstByte.toString('hex')) {
      case 'fd':
        size = data.readUInt16LE(offset);
        offset += 2;
        break;
      case 'fe':
        size = data.readUInt32LE(offset);
        offset += 4;
        break;
      case 'ff':
        size = data.readBigUInt64LE(offset);
        offset += 8;
        break;
      default:
        size = firstByte.readUInt8();
    }

    offset = offset - _offset;

    return new this(size as number, offset);
  }

  static fromSize(size: number) {
    let buffer: Buffer;
    let sizeByte;

    if (size <= 252) {
      buffer = Buffer.alloc(1);
      buffer.writeUInt8(size, 0);
    } else if (size <= 65535) {
      buffer = Buffer.alloc(3);
      sizeByte = Buffer.from('fd', 'hex');
      sizeByte.copy(buffer);
      buffer.writeUInt16LE(size, 1);
    } else if (size <= 4294967295) {
      buffer = Buffer.alloc(5);
      sizeByte = Buffer.from('fe', 'hex');
      sizeByte.copy(buffer);
      buffer.writeUInt32LE(size, 1);
    } else if (size <= 18446744073709552000) {
      buffer = Buffer.alloc(9);
      sizeByte = Buffer.from('ff', 'hex');
      sizeByte.copy(buffer);
      buffer.writeBigInt64LE(size as unknown as bigint, 1);
    }
    return buffer!;
  }
}

module.exports = CompactSize;
