import { toBytesInt16, toBytesInt32, toBytesInt64 } from './BlfUtils';

export interface Ban {
  banType: number;
  banMessageIndex: number;
  startTime: bigint;
  endTime: bigint;
}

export default class UserBans {
  bans: Ban[];

  toBuffer = () => {
    const fubhBytes = new Uint8Array(0x14 + 24 * this.bans.length);
    fubhBytes.set(Buffer.from('fubh', 'utf8'), 0);
    fubhBytes.set(toBytesInt32(fubhBytes.length), 4);
    fubhBytes.set(toBytesInt16(1), 8);
    fubhBytes.set(toBytesInt16(1), 10);
    fubhBytes.set(toBytesInt32(this.bans.length), 12);
    fubhBytes.set(toBytesInt32(0), 16);
    for (let i = 0; i < this.bans.length; i++) {
      const ban = this.bans[i];

      fubhBytes.set(toBytesInt32(ban.banType), 20 + 24 * i);
      fubhBytes.set(toBytesInt32(ban.banMessageIndex), 24 + 24 * i);
      fubhBytes.set(toBytesInt64(ban.startTime), 28 + 24 * i);
      fubhBytes.set(toBytesInt64(ban.endTime), 36 + 24 * i);
    }

    return Buffer.from(fubhBytes);
  };
}
