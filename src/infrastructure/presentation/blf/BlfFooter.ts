import { toBytesInt16, toBytesInt32 } from './BlfUtils';

export default class BlfFooter {
  constructor(private readonly lengthUpToFooter: number) {}

  toBuffer = () => {
    const eofBytes = new Uint8Array(0x11);
    eofBytes.set(Buffer.from('_blf', 'utf8'), 0);
    eofBytes.set(toBytesInt32(eofBytes.length), 4);
    eofBytes.set(toBytesInt16(1), 8);
    eofBytes.set(toBytesInt16(1), 10);
    eofBytes.set(toBytesInt32(this.lengthUpToFooter), 12);

    return Buffer.from(eofBytes);
  };
}
