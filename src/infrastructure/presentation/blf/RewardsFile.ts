import BlfFooter from "./BlfFooter";
import BlfHeader from "./BlfHeader";
import DailyChallenges from "./DailyChallenges";
import RewardsPersistance from "./RewardsPersistance";

export function getBuffer(
    rpdl: RewardsPersistance,
    dcha: DailyChallenges,
  ) {
    const buffer = Buffer.concat([
      new BlfHeader().toBuffer(),
      rpdl.toBuffer(),
      dcha.toBuffer(),
    ]);
  
    const eof = new BlfFooter(buffer.length);
  
    return Buffer.concat([buffer, eof.toBuffer()]);
  }
  