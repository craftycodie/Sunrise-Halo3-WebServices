import { toBytesInt16, toBytesInt32 } from './BlfUtils';

export default class BlfHeader {
  toBuffer = () => {
    const blfBytes = new Uint8Array(0x30);
    blfBytes.set(Buffer.from('_blf', 'utf8'), 0);
    blfBytes.set(toBytesInt32(blfBytes.length), 4);
    blfBytes.set(toBytesInt16(1), 8);
    blfBytes.set(toBytesInt16(2), 10);
    blfBytes.set(toBytesInt16(0xfffe), 12);

    return Buffer.from(blfBytes);
  };
}
