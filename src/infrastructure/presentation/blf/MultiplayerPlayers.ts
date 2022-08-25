import { ServiceRecordProps } from 'src/domain/entities/ServiceRecord';
import ServiceRecord from './ServiceRecord';

function readLong(arrayBuffer: ArrayBuffer) {
  return BigInt('0x' + Buffer.from(arrayBuffer).toString('hex')).toString();
}

function readNumber(arrayBuffer: ArrayBuffer) {
  return Number('0x' + Buffer.from(arrayBuffer).toString('hex'));
}

type MPPLPlayerRecord = Omit<
  ServiceRecordProps,
  | 'id'
  | 'campaignProgress'
  | 'highestSkill'
  | 'unknownInsignia'
  | 'unknownInsignia2'
> & { xuid: string };

export function readPlayers(arrayBuffer: ArrayBuffer): MPPLPlayerRecord[] {
  if (arrayBuffer.byteLength < 0x11e0)
    throw new Error('Not enough bytes for players');

  const players: MPPLPlayerRecord[] = [];

  for (let i = 0; i < 16; i++) {
    const offset = i * 0x11e;
    if (readLong(arrayBuffer.slice(offset + 0x4e, offset + 0x56)) == '0')
      continue;

    players.push({
      playerName: Buffer.from(arrayBuffer.slice(offset + 0xe, offset + 0x2e))
        .swap16()
        .toString('utf16le')
        .replace(/[\x00]/g, ''),
      appearanceFlags: readNumber(
        arrayBuffer.slice(offset + 0x2e, offset + 0x2f),
      ),
      primaryColor: readNumber(arrayBuffer.slice(offset + 0x2f, offset + 0x30)),
      secondaryColor: readNumber(
        arrayBuffer.slice(offset + 0x30, offset + 0x31),
      ),
      tertiaryColor: readNumber(
        arrayBuffer.slice(offset + 0x31, offset + 0x32),
      ),
      model: readNumber(arrayBuffer.slice(offset + 0x32, offset + 0x33)),
      foregroundEmblem: readNumber(
        arrayBuffer.slice(offset + 0x33, offset + 0x34),
      ),
      backgroundEmblem: readNumber(
        arrayBuffer.slice(offset + 0x34, offset + 0x35),
      ),
      emblemFlags: readNumber(arrayBuffer.slice(offset + 0x35, offset + 0x36)),
      emblemPrimaryColor: readNumber(
        arrayBuffer.slice(offset + 0x37, offset + 0x38),
      ),
      emblemSecondaryColor: readNumber(
        arrayBuffer.slice(offset + 0x38, offset + 0x39),
      ),
      emblemBackgroundColor: readNumber(
        arrayBuffer.slice(offset + 0x39, offset + 0x3a),
      ),
      spartanHelmet: readNumber(
        arrayBuffer.slice(offset + 0x3c, offset + 0x3d),
      ),
      spartanLeftShounder: readNumber(
        arrayBuffer.slice(offset + 0x3d, offset + 0x3e),
      ),
      spartanRightShoulder: readNumber(
        arrayBuffer.slice(offset + 0x3e, offset + 0x3f),
      ),
      spartanBody: readNumber(arrayBuffer.slice(offset + 0x3f, offset + 0x40)),
      eliteHelmet: readNumber(arrayBuffer.slice(offset + 0x40, offset + 0x41)),
      eliteLeftShoulder: readNumber(
        arrayBuffer.slice(offset + 0x41, offset + 0x42),
      ),
      eliteRightShoulder: readNumber(
        arrayBuffer.slice(offset + 0x42, offset + 0x43),
      ),
      eliteBody: readNumber(arrayBuffer.slice(offset + 0x43, offset + 0x44)),
      serviceTag: Buffer.from(arrayBuffer.slice(offset + 0x44, offset + 0x4e))
        .swap16()
        .toString('utf16le')
        .replace(/[\x00]/g, ''),
      xuid: Buffer.from(
        arrayBuffer.slice(offset + 0x4e, offset + 0x56),
      ).toString('hex'),
      totalEXP: readNumber(arrayBuffer.slice(offset + 0x102, offset + 0x106)),
      rank: readNumber(arrayBuffer.slice(offset + 0x106, offset + 0x10a)) - 1,
      grade: readNumber(arrayBuffer.slice(offset + 0x10a, offset + 0x10e)),
    });
  }

  return players;
}
