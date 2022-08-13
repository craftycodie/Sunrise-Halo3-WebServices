import SlotNumber from 'src/domain/value-objects/SlotNumber';
import UserID from 'src/domain/value-objects/UserId';

export class DeleteFileCommand {
  constructor(
    public readonly userID: UserID,
    public readonly shareID: UserID,
    public readonly slot: SlotNumber,
  ) {}
}
