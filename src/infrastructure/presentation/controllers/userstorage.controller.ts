import {
  Controller,
  Get,
  Header,
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
    // return await this.sendLocalFile(
    //   `${unk1}/${unk2}/${unk3}/${xuid}/user.bin`,
    //   res,
    // );

    if (xuid === '000901FC3FB8FE71')
      return await this.sendLocalFile(`codie.bin`, res);

    return await this.sendLocalFile(`user.bin`, res);
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
