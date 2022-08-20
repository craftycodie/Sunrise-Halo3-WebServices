import {
  toBigEndianUnicodeBytes,
  toBytesInt16,
  toBytesInt32,
  toBytesInt64,
} from './BlfUtils';

export interface Transfer {
  shareXuid: bigint;
  slot: number;
  unknownC: number;
  serverId: bigint;
  fileName: string;
  fileType: number;
  unknown3C: number;
  mapId: number;
  unknown44: number;
  unknown48: number;
  sizeBytes: number;
}

export default class FileQueue {
  transfers: Transfer[];

  toBuffer = () => {
    const fubhBytes = new Uint8Array(0xc + 8 * 80);
    fubhBytes.set(Buffer.from('filq', 'utf8'), 0);
    fubhBytes.set(toBytesInt32(fubhBytes.length), 4);
    fubhBytes.set(toBytesInt16(1), 8);
    fubhBytes.set(toBytesInt16(1), 10);
    for (let i = 0; i < this.transfers.length; i++) {
      const transfer = this.transfers[i];

      fubhBytes.set(toBytesInt64(transfer.shareXuid), 12 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.slot), 20 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.unknownC), 24 + 80 * i);
      fubhBytes.set(toBytesInt64(transfer.serverId), 28 + 80 * i);
      fubhBytes.set(
        toBigEndianUnicodeBytes(transfer.fileName, 32),
        36 + 80 * i,
      );
      fubhBytes.set(toBytesInt32(transfer.fileType), 68 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.unknown3C), 72 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.mapId), 76 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.unknown44), 80 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.unknown48), 84 + 80 * i);
      fubhBytes.set(toBytesInt32(transfer.sizeBytes), 88 + 80 * i);
    }

    return Buffer.from(fubhBytes);
  };
}
