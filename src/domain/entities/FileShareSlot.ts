import ContentHeader from '../value-objects/ContentHeader';
import SlotNumber from '../value-objects/SlotNumber';
import UniqueID from '../value-objects/UniqueID';
import Uuid from '../value-objects/Uuid';

export interface FileShareSlotProps {
  id: Uuid;
  slotNumber: SlotNumber;
  uniqueId: UniqueID;
  header: ContentHeader;
  data: Buffer;
}

export default class FileShareSlot implements FileShareSlotProps {
  public constructor(props: FileShareSlotProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  slotNumber: SlotNumber;
  uniqueId: UniqueID;
  header: ContentHeader;
  data: Buffer;

  static create(props: Omit<FileShareSlotProps, 'id'>): FileShareSlot {
    return new FileShareSlot({ ...props, id: Uuid.create() });
  }
}
