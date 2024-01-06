import { toBytesInt16, toBytesInt32, toUtf8Bytes, toBytesInt8 } from './BlfUtils';

export default class OmahaPlayerData {
  hopperAccess: number;
  bungieUserRole: number;
  hopperDirectory: string;

  toBuffer = () => {
    const sridBytes = new Uint8Array(0x45 + 0xc);
    sridBytes.set(Buffer.from('fupd', 'utf8'), 0);
    sridBytes.set(toBytesInt32(0x45 + 0xc), 4);
    sridBytes.set(toBytesInt16(7), 8);
    sridBytes.set(toBytesInt16(1), 10);
    sridBytes.set(toBytesInt8(this.hopperAccess), 12);
    sridBytes.set(toBytesInt16(this.bungieUserRole), 13);
    sridBytes.set(toUtf8Bytes(this.hopperDirectory, 0x20), 16);
    sridBytes.set(toBytesInt8(1), 0xc + 0x44);

    return Buffer.from(sridBytes);
  };
}
