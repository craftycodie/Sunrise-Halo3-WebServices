import UserID from 'src/domain/value-objects/UserId';

export class CreateUserCommand {
  constructor(public readonly xuid: UserID) {}
}
