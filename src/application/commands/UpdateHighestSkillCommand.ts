import UserID from 'src/domain/value-objects/UserId';

export class UpdateHighestSkillCommand {
  constructor(
    public readonly xuid: UserID,
    public readonly highestSkill: number,
  ) {}
}
