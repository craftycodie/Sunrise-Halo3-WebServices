import {
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
  async uploadStats(@UploadedFile() upload: Express.Multer.File) {
    console.log(upload);
    if (upload.mimetype === 'application/x-halo3-multi') {
      await writeFile(
        join(
          process.cwd(),
          'uploads/webstats',
          upload.originalname + '_' + new Date().getTime().toString(),
        ),
        upload.buffer,
      );
    }

    if (upload.mimetype === 'application/x-halo3-qos') {
      await writeFile(
        join(
          process.cwd(),
          'uploads/qos',
          upload.originalname + '_' + new Date().getTime().toString(),
        ),
        upload.buffer,
      );
    }

    return;
  }

  @Post('/upload.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadDump(@UploadedFile() upload: Express.Multer.File) {
    console.log(upload);
    await writeFile(
      join(process.cwd(), 'uploads/crashes', upload.originalname),
      upload.buffer,
    );
    return;
  }
}
