import {
  BadRequestException,
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
import { ApiTags } from '@nestjs/swagger';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { inflate } from 'pako';

@ApiTags('Sunrise')
@Controller('/sunrise')
export class SunriseController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/screenshots')
  async screenshots(@Res({ passthrough: true }) res: Response) {
    const path = join(process.cwd(), `uploads/fileshare`);
    const files = await readdir(path);

    return `
<html>
    <body>
        <h1>Sunrise Screenshots</h1>
        ${files.map(
          (file) => `<img onerror="this.style.display='none'" height="450" src="/sunrise/screenshot/${file}"/>`,
        )}
    </body>
</html>
`;
  }

  swap32(val) {
    return (
      ((val & 0xff) << 24) |
      ((val & 0xff00) << 8) |
      ((val >> 8) & 0xff00) |
      ((val >> 24) & 0xff)
    );
  }

  @Get('/screenshot/:filename')
  @Header('Content-Type', 'image/jpeg')
  async test(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') filename: string,
  ) {
    const path = join(process.cwd(), `uploads/fileshare`, filename);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    const compressedBuffer = await readFile(path);

    const fileType = this.swap32(
      new Uint32Array(compressedBuffer.buffer.slice(0xf8, 0xfc))[0],
    );

    if (fileType != 13)
      throw new BadRequestException('The provided file is not a screenshot.');

    const cmpLegth = this.swap32(
      new Uint32Array(compressedBuffer.buffer.slice(0x2ac, 0x2b0))[0],
    );
    const uncompressedBuffer = Buffer.from(
      inflate(compressedBuffer.buffer.slice(0x2b9, 0x2a8 + cmpLegth)).subarray(
        16,
      ),
    );

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(uncompressedBuffer);
  }
}
