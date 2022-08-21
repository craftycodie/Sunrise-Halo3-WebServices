import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { inflate } from 'pako';
import { Response } from 'express';

@ApiTags('Upload Server')
@Controller('/upload_server')
export class UploadServerController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/stats.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadStats(
    @UploadedFile() upload: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!upload.mimetype.startsWith('application/x-halo3-'))
      throw new BadRequestException(`Unrecognized file!`);

    const filetype = upload.mimetype.replace('application/x-halo3-', '');

    await writeFile(
      join(
        process.cwd(),
        'uploads',
        filetype,
        upload.originalname + '_' + new Date().getTime().toString(),
      ),
      inflate(upload.buffer.subarray(12)),
    );

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
