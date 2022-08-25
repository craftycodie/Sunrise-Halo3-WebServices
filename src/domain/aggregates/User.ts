import Ban from '../entities/Ban';
import ServiceRecord, { ServiceRecordProps } from '../entities/ServiceRecord';
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

  public updateServiceRecord = (
    serviceRecord: Partial<Omit<ServiceRecordProps, 'id'>>,
  ) => {
    this.serviceRecord.update(serviceRecord);
  };

  static create(props: Omit<UserProps, 'id'>): User {
    return new User({ ...props, id: Uuid.create() });
  }
}
