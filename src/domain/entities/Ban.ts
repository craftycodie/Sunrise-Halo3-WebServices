import BanMessageIndex from '../value-objects/BanMessageIndex';
import BanType from '../value-objects/BanType';
import Uuid from '../value-objects/Uuid';

export interface BanProps {
  id: Uuid;
  banType: BanType;
  banMessageIndex: BanMessageIndex;
  startTime?: Date;
  endTime?: Date;
}

export default class Ban implements BanProps {
  public constructor(props: BanProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  banType: BanType;
  banMessageIndex: BanMessageIndex;
  startTime?: Date;
  endTime?: Date;

  static create(props: Omit<BanProps, 'id'>): Ban {
    return new Ban({ ...props, id: Uuid.create() });
  }
}
