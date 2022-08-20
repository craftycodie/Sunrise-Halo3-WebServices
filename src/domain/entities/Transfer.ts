import SlotNumber from '../value-objects/SlotNumber';
import UserID from '../value-objects/UserId';
import Uuid from '../value-objects/Uuid';

export interface TransferProps {
  id: Uuid;
  shareId: UserID;
  slot: SlotNumber;
  fileName: string;
  fileType: number;
  mapId?: number;
  sizeBytes: number;
}

export default class Transfer implements TransferProps {
  public constructor(props: TransferProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  shareId: UserID;
  slot: SlotNumber;
  fileName: string;
  fileType: number;
  mapId?: number;
  sizeBytes: number;

  static create(props: Omit<TransferProps, 'id'>): Transfer {
    return new Transfer({ ...props, id: Uuid.create() });
  }
}
