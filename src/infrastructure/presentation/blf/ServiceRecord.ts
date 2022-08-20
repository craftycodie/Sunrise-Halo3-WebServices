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

export default class ServiceRecord {
  playerName: string; // wide, 16 chars
  appearanceFlags: number; // includes gender
  primaryColor: Color;
  secondaryColor: Color;
  tertiaryColor: Color;
  model: PlayerModel;
  foregroundEmblem: number;
  backgroundEmblem: number;
  emblemFlags: number; // Whether the secondary layer is shown or not.
  emblemPrimaryColor: Color;
  emblemSecondaryColor: Color;
  emblemBackgroundColor: Color;
  spartanHelmet: SpartanHelmet;
  spartanLeftShounder: SpartanShoulder;
  spartanRightShoulder: SpartanShoulder;
  spartanBody: SpartanBody;
  eliteHelmet: EliteArmour;
  eliteLeftShoulder: EliteArmour;
  eliteRightShoulder: EliteArmour;
  eliteBody: EliteArmour;
  serviceTag: string; // wide, 5 characters long for some reason
  campaignProgress: number;
  highestSkill: number;
  totalEXP: number;
  unknownInsignia: number;
  rank: Rank;
  grade: number;
  unknownInsignia2: number;

  toBuffer = () => {
    const sridBytes = new Uint8Array(0x68);
    sridBytes.set(Buffer.from('srid', 'utf8'), 0);
    sridBytes.set(toBytesInt32(0x68), 4);
    sridBytes.set(toBytesInt16(2), 8);
    sridBytes.set(toBytesInt16(1), 10);
    sridBytes.set(toBigEndianUnicodeBytes(this.playerName, 32), 12);
    sridBytes.set(toBytesInt8(this.appearanceFlags), 44);
    sridBytes.set(toBytesInt8(this.primaryColor), 45);
    sridBytes.set(toBytesInt8(this.secondaryColor), 46);
    sridBytes.set(toBytesInt8(this.tertiaryColor), 47);
    sridBytes.set(toBytesInt8(this.model), 48);
    sridBytes.set(toBytesInt8(this.foregroundEmblem), 49);
    sridBytes.set(toBytesInt8(this.backgroundEmblem), 50);
    sridBytes.set(toBytesInt8(this.emblemFlags), 51);
    sridBytes.set(toBytesInt8(0), 52);
    sridBytes.set(toBytesInt8(this.emblemPrimaryColor), 53);
    sridBytes.set(toBytesInt8(this.emblemSecondaryColor), 54);
    sridBytes.set(toBytesInt8(this.emblemBackgroundColor), 55);
    sridBytes.set(toBytesInt16(0), 56);
    sridBytes.set(toBytesInt8(this.spartanHelmet), 58);
    sridBytes.set(toBytesInt8(this.spartanLeftShounder), 59);
    sridBytes.set(toBytesInt8(this.spartanRightShoulder), 60);
    sridBytes.set(toBytesInt8(this.spartanBody), 61);
    sridBytes.set(toBytesInt8(this.eliteHelmet), 62);
    sridBytes.set(toBytesInt8(this.eliteLeftShoulder), 63);
    sridBytes.set(toBytesInt8(this.eliteRightShoulder), 64);
    sridBytes.set(toBytesInt8(this.eliteBody), 65);
    sridBytes.set(toBigEndianUnicodeBytes(this.serviceTag, 5), 66);
    sridBytes.set(toBytesInt32(this.campaignProgress), 76);
    sridBytes.set(toBytesInt32(this.highestSkill), 80);
    sridBytes.set(toBytesInt32(this.totalEXP), 84);
    sridBytes.set(toBytesInt32(this.unknownInsignia), 88);
    sridBytes.set(toBytesInt32(this.rank), 92);
    sridBytes.set(toBytesInt32(this.grade), 96);
    sridBytes.set(toBytesInt32(this.unknownInsignia2), 100);

    return Buffer.from(sridBytes);
  };
}
