import BlfFooter from './BlfFooter';
import BlfHeader from './BlfHeader';
import FileQueue from './FileQueue';
import OmahaPlayerData from './OmahaPlayerData';
import PlayerData from './PlayerData';
import ServiceRecord from './ServiceRecord';
import UserBans from './UserBans';

export function getBuffer(
  srid: ServiceRecord,
  fupd: PlayerData | OmahaPlayerData,
  fubh: UserBans,
  filq: FileQueue,
) {
  const buffer = Buffer.concat([
    new BlfHeader().toBuffer(),
    fupd.toBuffer(),
    srid.toBuffer(),
    fubh.toBuffer(),
    filq.toBuffer(),
  ]);

  const eof = new BlfFooter(buffer.length);

  return Buffer.concat([buffer, eof.toBuffer()]);
}
