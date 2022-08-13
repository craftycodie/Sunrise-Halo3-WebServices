import ContentHeader from '../value-objects/ContentHeader';
import UserID from '../value-objects/UserId';
import Uuid from '../value-objects/Uuid';

export interface ScreenshotProps {
  id: Uuid;
  userId: UserID;
  header: ContentHeader;
  data: Buffer;
}

export default class Screenshot implements ScreenshotProps {
  public constructor(props: ScreenshotProps) {
    Object.assign(this, props);
  }

  id: Uuid;
  userId: UserID;
  header: ContentHeader;
  data: Buffer;

  static create(props: Omit<ScreenshotProps, 'id'>): Screenshot {
    return new Screenshot({ ...props, id: Uuid.create() });
  }
}
