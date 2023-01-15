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

@ApiTags('Machine Storage')
@Controller('/storage/machine')
export class MachineStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/:unk1/:unk2/:xuid/machine.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getDeltaMachine(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getMachineFile(xuid, res);
  }

  @Get('/:titleId/:unk1/:unk2/:unk3/:xuid/machine.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getOmahaMachine(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getMachineFile(xuid, res);
  }

  @Get('/:unk1/:unk2/:unk3/:xuid/machine.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getMachineFile(
    @Param('xuid') xuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return await this.sendLocalFile(
    //   `${unk1}/${unk2}/${unk3}/${xuid}/machine.bin`,
    //   res,
    // );

    return await this.sendLocalFile(`machine.bin`, res);
  }

  private async sendLocalFile(path: string, res: Response) {
    path = join(process.cwd(), `public/storage/machine/`, path);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(createReadStream(path));
  }
}
