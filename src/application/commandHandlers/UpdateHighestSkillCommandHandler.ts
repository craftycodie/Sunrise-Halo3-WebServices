import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import IUserRepository, {
  IUserRepositorySymbol,
} from 'src/domain/repositories/IUserRepository';
import { UpdateHighestSkillCommand } from '../commands/UpdateHighestSkillCommand';

@CommandHandler(UpdateHighestSkillCommand)
export class UpdateHighestSkillCommandHandler
  implements ICommandHandler<UpdateHighestSkillCommand>
{
  constructor(
    @Inject(IUserRepositorySymbol)
    private repository: IUserRepository,
  ) {}

  async execute(command: UpdateHighestSkillCommand) {
    const user = await this.repository.findByXuid(command.xuid);
    user.setHighestSkill(command.highestSkill);
    return await this.repository.save(user);
  }
}
