import ShareID from 'src/domain/value-objects/ShareId';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import UserID from 'src/domain/value-objects/UserId';

export class DeleteFileCommand {
  constructor(
    public readonly userID: UserID,
    public readonly shareID: ShareID,
    public readonly slot: SlotNumber,
  ) {}
}
