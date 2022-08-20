import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { stat } from 'fs/promises';
import { Response } from 'express';
import Color from 'src/domain/value-objects/Color';
import PlayerModel from 'src/domain/value-objects/PlayerModel';
import SpartanHelmet from 'src/domain/value-objects/SpartanHelmet';
import SpartanShoulder from 'src/domain/value-objects/SpartanShoulder';
import SpartanBody from 'src/domain/value-objects/SpartanBody';
import EliteArmour from 'src/domain/value-objects/EliteArmour';
import Rank from 'src/domain/value-objects/Rank';
import ServiceRecord from '../blf/ServiceRecord';
import PlayerData from '../blf/PlayerData';
import UserBans from '../blf/UserBans';
import FileQueue from '../blf/FileQueue';
import BlfHeader from '../blf/BlfHeader';
import BlfFooter from '../blf/BlfFooter';
import { getBuffer } from '../blf/UserFile';

@ApiTags('User Storage')
@Controller('/storage/user')
export class UserStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/:unk1/:unk2/:unk3/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getUser(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const srid = new ServiceRecord();
    srid.playerName = 'Placeholder';
    srid.appearanceFlags = 0;
    srid.primaryColor = Color.GREEN;
    srid.secondaryColor = Color.GREEN;
    srid.tertiaryColor = Color.GREEN;
    srid.model = PlayerModel.SPARTAN;
    srid.foregroundEmblem = 1;
    srid.backgroundEmblem = 1;
    srid.emblemFlags = 0;
    srid.emblemPrimaryColor = Color.YELLOW;
    srid.emblemSecondaryColor = Color.BROWN;
    srid.emblemBackgroundColor = Color.GREEN;
    srid.spartanHelmet = SpartanHelmet.DEFAULT;
    srid.spartanLeftShounder = SpartanShoulder.DEFAULT;
    srid.spartanRightShoulder = SpartanShoulder.DEFAULT;
    srid.spartanBody = SpartanBody.DEFAULT;
    srid.eliteHelmet = EliteArmour.DEFAULT;
    srid.eliteLeftShoulder = EliteArmour.DEFAULT;
    srid.eliteRightShoulder = EliteArmour.DEFAULT;
    srid.eliteBody = EliteArmour.DEFAULT;
    srid.serviceTag = 'TEST';
    srid.campaignProgress = 0;
    srid.highestSkill = 1;
    srid.totalEXP = 1;
    srid.unknownInsignia = 0;
    srid.rank = Rank.RECRUIT;
    srid.grade = 0;
    srid.unknownInsignia2 = 0;

    const fupd = new PlayerData();
    fupd.hopperAccess = 1;
    fupd.bungieUserRole = 1;
    fupd.highestSkill = 1;
    fupd.hopperDirectory = 'test_hoppers';

    const fubh = new UserBans();
    fubh.bans = [
      {
        banType: 1,
        banMessageIndex: 0,
        startTime: BigInt('1640995200'),
        endTime: BigInt('1672531200'),
      },
    ];

    const filq = new FileQueue();
    filq.transfers = [
      {
        shareXuid: BigInt('0xffffffffffffff01'),
        fileName: 'Test Transfer',
        mapId: 30,
        slot: 1,
        unknownC: 0,
        unknown3C: 0,
        unknown44: 0,
        unknown48: 0,
        sizeBytes: 100000,
        serverId: BigInt('1'),
        fileType: 11,
      },
    ];

    return new StreamableFile(getBuffer(srid, fupd, fubh, filq));
  }

  @Get('/:unk1/:unk2/:unk3/:xuid/recent_players.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getRecentPlayers(
    @Param('unk1') unk1: string,
    @Param('unk2') unk2: string,
    @Param('unk3') unk3: string,
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return await this.sendLocalFile(
    //   `${unk1}/${unk2}/${unk3}/${xuid}/recent_players.bin`,
    //   res,
    // );

    return await this.sendLocalFile(`recent_players.bin`, res);
  }

  private async sendLocalFile(path: string, res: Response) {
    path = join(process.cwd(), `public/storage/user/`, path);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(createReadStream(path));
  }
}
