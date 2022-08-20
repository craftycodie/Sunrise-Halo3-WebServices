import Ban from '../entities/Ban';
import ServiceRecord from '../entities/ServiceRecord';
import Transfer from '../entities/Transfer';
import UserID from '../value-objects/UserId';
import Uuid from '../value-objects/Uuid';
import PlayerData from '../entities/PlayerData';

export interface UserProps {
  id: Uuid;
  xuid: UserID;
  bans: Ban[];
  transfers: Transfer[];
  serviceRecord: ServiceRecord;
  playerData: PlayerData;
}

export default class User implements UserProps {
  public constructor(props: UserProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  xuid: UserID;
  bans: Ban[];
  transfers: Transfer[];
  serviceRecord: ServiceRecord;
  playerData: PlayerData;

  public setHighestSkill = (highestSkill: number) => {
    this.serviceRecord.setHighestSkill(highestSkill);
  };

  static create(props: Omit<UserProps, 'id'>): User {
    return new User({ ...props, id: Uuid.create() });
  }
}
