import ContentHeader from 'src/domain/value-objects/ContentHeader';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import UserID from 'src/domain/value-objects/UserId';

export class UploadFileCommand {
  constructor(
    public readonly userID: UserID,
    public readonly shareID: UserID,
    public readonly slot: SlotNumber,
    public readonly header: ContentHeader,
    public readonly file: Buffer,
  ) {}
}
