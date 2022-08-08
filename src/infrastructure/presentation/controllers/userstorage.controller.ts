import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  StreamableFile,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('User Storage')
@Controller('/user')
export class UserStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/0/0/00/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getUser(@Param('xuid') xuid: string) {
    const file = createReadStream(
      join(process.cwd(), `public/user/0/0/00/${xuid}/user.bin`),
    );
    return new StreamableFile(file);
  }

  @Get('/0/0/00/:xuid/user.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getRecentPlayers(@Param('xuid') xuid: string) {
    const file = createReadStream(
      join(process.cwd(), `public/user/0/0/00/${xuid}/recent_players.bin`),
    );
    return new StreamableFile(file);
  }
}
