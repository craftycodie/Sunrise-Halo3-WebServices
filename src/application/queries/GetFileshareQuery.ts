import GameID from 'src/domain/value-objects/GameID';
import Locale from 'src/domain/value-objects/Locale';
import UserID from 'src/domain/value-objects/UserId';

export class GetFileshareQuery {
  constructor(
    public readonly shareID: UserID,
    public readonly title?: GameID,
    public readonly userID?: UserID,
    public readonly locale?: Locale,
  ) {}
}
