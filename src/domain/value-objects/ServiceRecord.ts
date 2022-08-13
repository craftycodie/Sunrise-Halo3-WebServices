import Color from './Color';
import EliteArmour from './EliteArmour';
import PlayerModel from './PlayerModel';
import Rank from './Rank';
import SpartanBody from './SpartanBody';
import SpartanHelmet from './SpartanHelmet';
import SpartanShoulder from './SpartanShoulder';

export default interface ServiceRecord {
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
}
