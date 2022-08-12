import GameID from 'src/domain/value-objects/GameID';
import Locale from 'src/domain/value-objects/Locale';
import ShareID from 'src/domain/value-objects/ShareId';
import UserID from 'src/domain/value-objects/UserId';

export class GetFileshareQuery {
  constructor(
    public readonly title: GameID,
    public readonly userID: UserID,
    public readonly shareID: ShareID,
    public readonly locale?: Locale,
  ) {}
}
