import UserID from 'src/domain/value-objects/UserId';

export class GetUserQuery {
  constructor(public readonly xuid: UserID) {}
}
