import FileShareSlot from '../entities/FileShareSlot';
import GameID from '../value-objects/GameID';
import ShareID from '../value-objects/ShareId';
import SlotNumber from '../value-objects/SlotNumber';
import UserID from '../value-objects/UserId';

interface FileShareProps {
  id: ShareID;
  userID: UserID;
  slots: FileShareSlot[];
  message?: string;
  quotaBytes: number;
  quotaSlots: number;
  visibleSlots: number;
  subscriptionHash: string;
}

export default class FileShare implements FileShareProps {
  public constructor(props: FileShareProps) {
    Object.assign(this, props);
  }

  // TODO: Give these private setters.
  id: ShareID;
  userID: UserID;
  slots: FileShareSlot[];
  message?: string;
  quotaBytes: number;
  quotaSlots: number;
  visibleSlots: number;
  subscriptionHash: string;

  uploadFile(slot: FileShareSlot): void {
    this.deleteFile(slot.slotNumber);
    this.slots.push(slot);
  }

  deleteFile(deleteSlotNumber: SlotNumber): void {
    this.slots = this.slots.filter(
      (slot) => slot.slotNumber.value != deleteSlotNumber.value,
    );
  }

  getFileData(getSlotNumber: SlotNumber): Buffer {
    return this.slots.find((slot) => slot.slotNumber == getSlotNumber).data;
  }

  public static create(props: FileShareProps): FileShare {
    return new FileShare({ ...props });
  }
}
