import ContentHeader from 'src/domain/value-objects/ContentHeader';

function readLong(arrayBuffer: ArrayBuffer) {
  return BigInt('0x' + Buffer.from(arrayBuffer).toString('hex')).toString();
}

function readNumber(arrayBuffer: ArrayBuffer) {
  return Number('0x' + Buffer.from(arrayBuffer).toString('hex'));
}

export function readContentHeader(arrayBuffer: ArrayBuffer): ContentHeader {
  if (arrayBuffer.byteLength < 0xf8)
    throw new Error('Not enough bytes for content header');

  return {
    buildNumber: readNumber(arrayBuffer.slice(0x0, 0x2)),
    mapVersion: readNumber(arrayBuffer.slice(0x2, 0x4)),
    uniqueId: readLong(arrayBuffer.slice(0x4, 0xc)),
    filename: Buffer.from(arrayBuffer.slice(0xc, 0x2c))
      .swap16()
      .toString('utf16le')
      .replace(/[\x00]/g, ''),
    description: Buffer.from(arrayBuffer.slice(0x2c, 0xac))
      .toString()
      .replace(/[\x00]/g, ''),
    author: Buffer.from(arrayBuffer.slice(0xac, 0xbc))
      .toString()
      .replace(/[\x00]/g, ''),
    filetype: readNumber(arrayBuffer.slice(0xbc, 0xc0)),
    authorXuidIsOnline: arrayBuffer[0xc0] > 0,
    authorXuid: Buffer.from(arrayBuffer.slice(0xc4, 0xcc)).toString('hex'),
    size: 0, //something is wrong with this -> readLong(arrayBuffer.slice(0xcc, 0xdc)),
    date: readLong(arrayBuffer.slice(0xd4, 0xdc)),
    lengthSeconds: readNumber(arrayBuffer.slice(0xdc, 0xe0)),
    campaignId: readNumber(arrayBuffer.slice(0xe0, 0xe4)),
    mapId: readNumber(arrayBuffer.slice(0xe4, 0xe8)),
    gameEngineType: readNumber(arrayBuffer.slice(0xe8, 0xec)),
    campaignDifficulty: readNumber(arrayBuffer.slice(0xec, 0xf0)),
    hopperId: readNumber(arrayBuffer.slice(0xf0, 0xf2)),
    gameId: readNumber(arrayBuffer.slice(0xf4, 0xf8)),
    campaignInsertionPoint: 0,
    campaignSurvivalEnabled: false,
  };
}
