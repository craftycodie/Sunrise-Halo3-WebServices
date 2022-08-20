import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import User from 'src/domain/aggregates/User';
import PlayerData from 'src/domain/entities/PlayerData';
import ServiceRecord from 'src/domain/entities/ServiceRecord';
import IUserRepository, {
  IUserRepositorySymbol,
} from 'src/domain/repositories/IUserRepository';
import Color from 'src/domain/value-objects/Color';
import EliteArmour from 'src/domain/value-objects/EliteArmour';
import PlayerModel from 'src/domain/value-objects/PlayerModel';
import Rank from 'src/domain/value-objects/Rank';
import SpartanBody from 'src/domain/value-objects/SpartanBody';
import SpartanHelmet from 'src/domain/value-objects/SpartanHelmet';
import SpartanShoulder from 'src/domain/value-objects/SpartanShoulder';
import { CreateUserCommand } from '../commands/CreateUserCommand';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(IUserRepositorySymbol)
    private repository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    return this.repository.save(
      User.create({
        xuid: command.xuid,
        bans: [],
        transfers: [],
        playerData: PlayerData.create({
          isBnetUser: false,
          isPro: false,
          isBungie: false,
          hasRecon: false,
          hopperAccess: 0,
          hopperDirectory: 'default_hoppers',
        }),
        serviceRecord: ServiceRecord.create({
          appearanceFlags: 0,
          primaryColor: Color.GREEN,
          secondaryColor: Color.GREEN,
          tertiaryColor: Color.GREEN,
          model: PlayerModel.SPARTAN,
          foregroundEmblem: 1,
          backgroundEmblem: 1,
          emblemFlags: 0,
          emblemPrimaryColor: Color.RED,
          emblemSecondaryColor: Color.WHITE,
          emblemBackgroundColor: Color.BLUE,
          spartanHelmet: SpartanHelmet.ODST,
          spartanLeftShounder: SpartanShoulder.DEFAULT,
          spartanRightShoulder: SpartanShoulder.DEFAULT,
          spartanBody: SpartanBody.DEFAULT,
          eliteHelmet: EliteArmour.DEFAULT,
          eliteLeftShoulder: EliteArmour.DEFAULT,
          eliteRightShoulder: EliteArmour.DEFAULT,
          eliteBody: EliteArmour.DEFAULT,
          serviceTag: 'TEST',
          campaignProgress: 0,
          highestSkill: 1,
          totalEXP: 1,
          unknownInsignia: 0,
          rank: Rank.RECRUIT,
          grade: 1,
          unknownInsignia2: 0,
        }),
      }),
    );
  }
}
