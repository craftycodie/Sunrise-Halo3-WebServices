import {
  BadRequestException,
  Controller,
  Inject,
  Post,
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

    return;
  }

  @Post('/upload.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadDump(@UploadedFile() upload: Express.Multer.File) {
    await writeFile(
      join(process.cwd(), 'uploads/crashes', upload.originalname),
      upload.buffer,
    );
    return;
  }
}
