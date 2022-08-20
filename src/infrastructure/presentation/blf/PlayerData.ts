import { toBytesInt16, toBytesInt32, toUtf8Bytes } from './BlfUtils';

export default class PlayerData {
  hopperAccess: number;
  bungieUserRole: number;
  highestSkill: number;
  hopperDirectory: string;

  toBuffer = () => {
    const sridBytes = new Uint8Array(0x38);
    sridBytes.set(Buffer.from('fupd', 'utf8'), 0);
    sridBytes.set(toBytesInt32(0x38), 4);
    sridBytes.set(toBytesInt16(3), 8);
    sridBytes.set(toBytesInt16(1), 10);
    sridBytes.set(toBytesInt32(this.hopperAccess), 12);
    sridBytes.set(toBytesInt32(this.bungieUserRole), 16);
    sridBytes.set(toBytesInt32(this.highestSkill), 20);
    sridBytes.set(toUtf8Bytes(this.hopperDirectory, 0x20), 24);

    return Buffer.from(sridBytes);
  };
}
