import ContentHeader from '../value-objects/ContentHeader';
import SlotNumber from '../value-objects/SlotNumber';
import UniqueID from '../value-objects/UniqueID';

export interface FileShareSlotProps {
  slotNumber: SlotNumber;
  uniqueId: UniqueID;
  header: ContentHeader;
  data: Buffer;
}

export default class FileShareSlot implements FileShareSlotProps {
  public constructor(props: FileShareSlotProps) {
    Object.assign(this, props);
  }

  slotNumber: SlotNumber;
  uniqueId: UniqueID;
  header: ContentHeader;
  data: Buffer;

  static create(props: FileShareSlotProps): FileShareSlot {
    return new FileShareSlot({ ...props });
  }
}
