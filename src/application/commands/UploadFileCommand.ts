import ContentHeader from 'src/domain/value-objects/ContentHeader';
import ShareID from 'src/domain/value-objects/ShareId';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import UserID from 'src/domain/value-objects/UserId';

export class UploadFileCommand {
  constructor(
    public readonly userID: UserID,
    public readonly shareID: ShareID,
    public readonly slot: SlotNumber,
    public readonly header: ContentHeader,
    public readonly file: Buffer,
  ) {}
}
