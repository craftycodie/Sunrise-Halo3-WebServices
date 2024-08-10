import {
    toBytesInt16,
    toBytesInt32,
    toBytesInt8,
  } from './BlfUtils';
  
  export default class RewardsPersistance {

    toBuffer = () => {
      const rpdlBytes = new Uint8Array(0x227)
        .fill(1); //unlock everything
      rpdlBytes.set(Buffer.from('rpdl', 'utf8'), 0);
      rpdlBytes.set(toBytesInt32(rpdlBytes.length), 4);
      rpdlBytes.set(toBytesInt16(2), 8);
      rpdlBytes.set(toBytesInt16(1), 10);
      rpdlBytes.set(toBytesInt32(20_000_000, false), 0xc);
      rpdlBytes.set(toBytesInt32(0), 0x227 - 8); // credits?
      rpdlBytes.set(toBytesInt32(0), 0x227 - 4); // credits?

      return Buffer.from(rpdlBytes);
    };
  }
  