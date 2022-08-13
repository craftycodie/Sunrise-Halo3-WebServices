import UserID from 'src/domain/value-objects/UserId';

export class GetPlayerScreenshotsQuery {
  constructor(public readonly userID: UserID) {}
}
