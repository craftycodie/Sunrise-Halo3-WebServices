import Uuid from '../value-objects/Uuid';

export interface PlayerDataProps {
  id: Uuid;
  hopperAccess: number;
  isBnetUser: boolean;
  isPro: boolean;
  isBungie: boolean;
  hasRecon: boolean;
  hopperDirectory: string;
}

export default class PlayerData implements PlayerDataProps {
  public constructor(props: PlayerDataProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  hopperAccess: number;
  isBnetUser: boolean;
  isPro: boolean;
  isBungie: boolean;
  hasRecon: boolean;
  hopperDirectory: string;

  public setHopperDirectory = (hopperDirectory: string) => {
    this.hopperDirectory = hopperDirectory;
  };

  public setHopperAccess = (hopperAccess: number) => {
    this.hopperAccess = hopperAccess;
  };

  public setBnetUser = (bnetUser: boolean) => {
    this.isBnetUser = bnetUser;
  };

  public setPro = (pro: boolean) => {
    this.isPro = pro;
  };

  public setBungie = (bungie: boolean) => {
    this.isBungie = bungie;
  };

  public setReconUnlocked = (reconUnlocked: boolean) => {
    this.hasRecon = reconUnlocked;
  };

  static create(props: Omit<PlayerDataProps, 'id'>): PlayerData {
    return new PlayerData({ ...props, id: Uuid.create() });
  }
}
