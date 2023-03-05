import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { inflate } from 'pako';
import { Response } from 'express';
import { readPlayers } from '../blf/MultiplayerPlayers';
import { UpdateServiceRecordCommand } from 'src/application/commands/UpdateServiceRecordCommand';
import UserID from 'src/domain/value-objects/UserId';

@ApiTags('Upload Server')
@Controller('/upload_server')
export class UploadServerController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @HttpCode(200)
  @Post('/stats.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadStats(
    @UploadedFile() upload: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    return;
    if (
      !upload.mimetype.startsWith('application/x-halo3-') &&
      !upload.mimetype.startsWith('application/x-atlas-') &&
      !upload.mimetype.startsWith('application/x-bungie-')
    ) 
      throw new BadRequestException(`Unrecognized file! ` + upload.mimetype);

    const filetype = upload.mimetype
      .replace('application/x-halo3-', '')
      .replace('application/x-atlas-', '')
      .replace('application/x-bungie-', '');

    if (filetype === 'multi') {
      const blf = inflate(upload.buffer.subarray(12));

      const players = readPlayers(blf.slice(0x4e4, 0x4e4 + 0x11e0));

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        // guests
        if (player.playerName.endsWith(')')) continue;
        this.commandBus.execute(
          await new UpdateServiceRecordCommand(new UserID(player.xuid), {
            ...player,
          }),
        );
      }
    }

    try {
      await writeFile(
        join(
          process.cwd(),
          'uploads',
          filetype,
          new Date().getTime().toString() + '_' + upload.originalname,
        ),
        inflate(upload.buffer.subarray(12)),
      );
    } catch (e) {
      await writeFile(
        join(
          process.cwd(),
          'uploads',
          filetype,
          new Date().getTime().toString() + '_' + upload.originalname,
        ),
        upload.buffer,
      );
    }

    res.status(200).send('');
  }

  @Post('/upload.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadDump(
    @UploadedFile() upload: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    await writeFile(
      join(process.cwd(), 'uploads/crashes', upload.originalname),
      upload.buffer,
    );

    res.status(200).send('');
  }
}
