import Color from 'src/domain/value-objects/Color';
import EliteArmour from 'src/domain/value-objects/EliteArmour';
import PlayerModel from 'src/domain/value-objects/PlayerModel';
import Rank from 'src/domain/value-objects/Rank';
import SpartanBody from 'src/domain/value-objects/SpartanBody';
import SpartanHelmet from 'src/domain/value-objects/SpartanHelmet';
import SpartanShoulder from 'src/domain/value-objects/SpartanShoulder';
import Uuid from '../value-objects/Uuid';

export interface ServiceRecordProps {
  id: Uuid;
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

export default class ServiceRecord implements ServiceRecordProps {
  public constructor(props: ServiceRecordProps) {
    Object.assign(this, props);
  }

  id: Uuid;
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

  public setHighestSkill = (highestSkill: number) => {
    this.highestSkill = highestSkill;
  };

  static create(props: Omit<ServiceRecordProps, 'id'>): ServiceRecord {
    return new ServiceRecord({ ...props, id: Uuid.create() });
  }
}
