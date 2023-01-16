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
import ServiceRecord from '../blf/ServiceRecord';
import PlayerData from '../blf/PlayerData';
import UserBans from '../blf/UserBans';
import FileQueue from '../blf/FileQueue';
import { getBuffer } from '../blf/UserFile';
import { GetUserQuery } from 'src/application/queries/GetUserQuery';
import UserID from 'src/domain/value-objects/UserId';
import User from 'src/domain/aggregates/User';
import { CreateUserCommand } from 'src/application/commands/CreateUserCommand';

@ApiTags('User Storage')
@Controller('/storage/user')
export class UserStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/:unk1/:unk2/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getBetaUser(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getUser('000901FC3FB8FE71', res);
  }

  @Get('/:titleId/:unk1/:unk2/:unk3/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getOmahaUser(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getUser(xuid, res);
  }

  @Get('/:titleId/:unk1/:unk2/:unk3/:xuid/recent_players.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getOmahaRecentPlayers(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getRecentPlayers(xuid, res);
  }

  @Get('/:unk1/:unk2/:unk3/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getUser(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let user: User = await this.queryBus.execute(
      new GetUserQuery(UserID.create(xuid)),
    );

    if (!user)
      user = await this.commandBus.execute(
        new CreateUserCommand(UserID.create(xuid)),
      );

    const srid = new ServiceRecord();
    srid.playerName = user.serviceRecord.playerName ?? '';
    srid.appearanceFlags = user.serviceRecord.appearanceFlags;
    srid.primaryColor = user.serviceRecord.primaryColor;
    srid.secondaryColor = user.serviceRecord.secondaryColor;
    srid.tertiaryColor = user.serviceRecord.tertiaryColor;
    srid.model = user.serviceRecord.model;
    srid.foregroundEmblem = user.serviceRecord.foregroundEmblem;
    srid.backgroundEmblem = user.serviceRecord.backgroundEmblem;
    srid.emblemFlags = user.serviceRecord.emblemFlags;
    srid.emblemPrimaryColor = user.serviceRecord.emblemPrimaryColor;
    srid.emblemSecondaryColor = user.serviceRecord.emblemSecondaryColor;
    srid.emblemBackgroundColor = user.serviceRecord.emblemBackgroundColor;
    srid.spartanHelmet = user.serviceRecord.spartanHelmet;
    srid.spartanLeftShounder = user.serviceRecord.spartanLeftShounder;
    srid.spartanRightShoulder = user.serviceRecord.spartanRightShoulder;
    srid.spartanBody = user.serviceRecord.spartanBody;
    srid.eliteHelmet = user.serviceRecord.eliteHelmet;
    srid.eliteLeftShoulder = user.serviceRecord.eliteLeftShoulder;
    srid.eliteRightShoulder = user.serviceRecord.eliteRightShoulder;
    srid.eliteBody = user.serviceRecord.eliteBody;
    srid.serviceTag = user.serviceRecord.serviceTag;
    srid.campaignProgress = user.serviceRecord.campaignProgress;
    srid.highestSkill = user.serviceRecord.highestSkill;
    srid.totalEXP = user.serviceRecord.totalEXP;
    srid.unknownInsignia = user.serviceRecord.unknownInsignia;
    srid.rank = user.serviceRecord.rank;
    srid.grade = user.serviceRecord.grade;
    srid.unknownInsignia2 = user.serviceRecord.unknownInsignia2;

    const fupd = new PlayerData();
    fupd.hopperAccess = user.playerData.hopperAccess;
    fupd.bungieUserRole = 0;
    //if (user.playerData.isBnetUser) fupd.bungieUserRole += 1;
    fupd.bungieUserRole += 1;
    if (user.playerData.isPro) fupd.bungieUserRole += 2;
    if (user.playerData.isBungie) fupd.bungieUserRole += 4;
    if (user.playerData.hasRecon) fupd.bungieUserRole += 8;
    fupd.highestSkill = user.serviceRecord.highestSkill;
    fupd.hopperDirectory = user.playerData.hopperDirectory;

    const fubh = new UserBans();
    fubh.bans = user.bans.map((ban) => ({
      banType: ban.banType,
      banMessageIndex: ban.banMessageIndex.value,
      startTime: BigInt(ban.startTime.getTime() / 1000),
      endTime: BigInt(ban.endTime.getTime() / 1000),
    }));

    const filq = new FileQueue();
    filq.transfers = user.transfers.map((transfer) => ({
      shareXuid: BigInt(transfer.shareId.value),
      fileName: transfer.fileName,
      mapId: transfer.mapId ?? 0,
      slot: transfer.slot.value,
      unknownC: 0,
      unknown3C: 0,
      unknown44: 0,
      unknown48: 0,
      sizeBytes: transfer.sizeBytes,
      serverId: BigInt('1'),
      fileType: transfer.fileType,
    }));

    return new StreamableFile(getBuffer(srid, fupd, fubh, filq));
  }

  @Get('/:unk1/:unk2/:unk3/:xuid/recent_players.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getRecentPlayers(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return await this.sendLocalFile(
    //   `${unk1}/${unk2}/${unk3}/${xuid}/recent_players.bin`,
    //   res,
    // );

    return await this.sendLocalFile(`recent_players.bin`, res);
  }

  @Get('/:unk1/:unk2/:xuid/recent_players_hopper_08.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getDeltaRecentPlayers(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
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
