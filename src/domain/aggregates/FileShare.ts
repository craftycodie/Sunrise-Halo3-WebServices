import FileShareSlot from '../entities/FileShareSlot';
import SlotNumber from '../value-objects/SlotNumber';
import UserID from '../value-objects/UserId';
import Uuid from '../value-objects/Uuid';

interface FileShareProps {
  id: Uuid;
  ownerId: UserID;
  slots: FileShareSlot[];
  message?: string;
  quotaBytes: number;
  quotaSlots: number;
  visibleSlots: number;
  subscriptionHash: number;
}

export default class FileShare implements FileShareProps {
  public constructor(props: FileShareProps) {
    Object.assign(this, props);
  }

  // TODO: Give these private setters.
  id: Uuid;
  ownerId: UserID;
  slots: FileShareSlot[];
  message?: string;
  quotaBytes: number;
  quotaSlots: number;
  visibleSlots: number;
  subscriptionHash: number;

  uploadFile(slot: FileShareSlot): void {
    this.deleteFile(slot.slotNumber);
    this.slots.push(slot);
  }

  deleteFile(deleteSlotNumber: SlotNumber): void {
    this.slots = this.slots.filter(
      (slot) => slot.slotNumber.value != deleteSlotNumber.value,
    );
  }

  getSlot(getSlotNumber: SlotNumber): FileShareSlot {
    return this.slots.find(
      (slot) => slot.slotNumber.value == getSlotNumber.value,
    );
  }

  getFileData(getSlotNumber: SlotNumber): Buffer {
    return this.slots.find(
      (slot) => slot.slotNumber.value == getSlotNumber.value,
    ).data;
  }

  public static create(props: Omit<FileShareProps, 'id'>): FileShare {
    return new FileShare({ ...props, id: Uuid.create() });
  }
}
