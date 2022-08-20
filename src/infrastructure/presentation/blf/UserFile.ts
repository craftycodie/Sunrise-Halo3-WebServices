import BlfFooter from './BlfFooter';
import BlfHeader from './BlfHeader';
import FileQueue from './FileQueue';
import PlayerData from './PlayerData';
import ServiceRecord from './ServiceRecord';
import UserBans from './UserBans';

export function getBuffer(
  srid: ServiceRecord,
  fupd: PlayerData,
  fubh: UserBans,
  filq: FileQueue,
) {
  const buffer = Buffer.concat([
    new BlfHeader().toBuffer(),
    fubh.toBuffer(),
    filq.toBuffer(),
    fupd.toBuffer(),
    srid.toBuffer(),
  ]);

  const eof = new BlfFooter(buffer.length);

  return Buffer.concat([buffer, eof.toBuffer()]);
}
