import Color from 'src/domain/value-objects/Color';
import EliteArmour from 'src/domain/value-objects/EliteArmour';
import PlayerModel from 'src/domain/value-objects/PlayerModel';
import Rank from 'src/domain/value-objects/Rank';
import SpartanBody from 'src/domain/value-objects/SpartanBody';
import SpartanHelmet from 'src/domain/value-objects/SpartanHelmet';
import SpartanShoulder from 'src/domain/value-objects/SpartanShoulder';
import {
  toBigEndianUnicodeBytes,
  toBytesInt16,
  toBytesInt32,
  toBytesInt8,
} from './BlfUtils';

export default class ODSTServiceRecord {
  toBuffer = () => {
    const osriBytes = new Uint8Array(0x6A0);
    osriBytes.set(Buffer.from('osri', 'utf8'), 0);
    osriBytes.set(toBytesInt32(0x6A0), 4);
    osriBytes.set(toBytesInt16(2), 8);
    osriBytes.set(toBytesInt16(1), 10);
    osriBytes.set(toBytesInt8(1), 0x680 + 0xC);
    osriBytes.set(toBytesInt8(0xFF), 0x681 + 0xC);
    return Buffer.from(osriBytes);
  };
}
