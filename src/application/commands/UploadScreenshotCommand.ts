import ContentHeader from 'src/domain/value-objects/ContentHeader';
import UserID from 'src/domain/value-objects/UserId';

export class UploadScreenshotCommand {
  constructor(
    public readonly userID: UserID,
    public readonly header: ContentHeader,
    public readonly file: Buffer,
  ) {}
}
