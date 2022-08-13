import GameID from 'src/domain/value-objects/GameID';
import UserID from 'src/domain/value-objects/UserId';

export class CreateFileShareCommand {
  constructor(
    public readonly title: GameID,
    public readonly userID: UserID,
    public readonly shareID: UserID,
  ) {}
}
