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

@ApiTags('Machine Storage')
@Controller('/machine')
export class MachineStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/0/0/00/:xuid/machine.bin')
  @ApiParam({ name: 'xuid', example: '000000000000EAD3' })
  async getMachineFile(@Param('xuid') xuid: string) {
    const file = createReadStream(
      join(process.cwd(), `public/machine/0/0/00/${xuid}/user.bin`),
    );
    return new StreamableFile(file);
  }
}
