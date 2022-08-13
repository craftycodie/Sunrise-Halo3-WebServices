import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { deflate, inflate } from 'pako';
import { GetFileshareQuery } from 'src/application/queries/GetFileshareQuery';
import ShareID from 'src/domain/value-objects/ShareId';
import FileShare from 'src/domain/aggregates/FileShare';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from 'src/application/commands/UploadFileCommand';
import UserID from 'src/domain/value-objects/UserId';

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
    const path = join(process.cwd(), `uploads/screenshots`);
    const files = await readdir(path);

    return `
<html>
    <body>
        <h1>Sunrise Screenshots</h1>
        ${files.map(
          (file) =>
            `<img onerror="this.style.display='none'" height="450" src="/sunrise/screenshot/${file}"/>`,
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

  @Get('/fileshare/:shareId/:slot')
  @Header('Content-Type', 'image/jpeg')
  async getFileshareScreenshot(
    @Res({ passthrough: true }) res: Response,
    @Param('shareId') shareId: string,
    @Param('slot') slotNumber: string,
  ) {
    const fileShare: FileShare = await this.queryBus.execute(
      new GetFileshareQuery(1, null, new ShareID(shareId)),
    );

    if (!fileShare) throw new NotFoundException();

    const slot = fileShare.getSlot(
      new SlotNumber(parseInt(slotNumber.replace('.jpg', ''))),
    );

    if (slot.header.filetype != 13 && slotNumber.includes('jpg'))
      throw new BadRequestException('The provided file is not a screenshot.');

    const compressedBuffer = slot.data;

    if (!slotNumber.includes('jpg')) {
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Length', compressedBuffer.byteLength.toString());
        res.set('Cache-Control', 'no-cache');
        return new StreamableFile(compressedBuffer);
    }


    const cmpLegth = this.swap32(
      new Uint32Array(compressedBuffer.buffer.slice(0x2ac, 0x2b0))[0],
    );
    const uncompressedBuffer = Buffer.from(
      inflate(compressedBuffer.buffer.slice(0x2b9, 0x2a8 + cmpLegth)).subarray(
        16,
      ),
    );

    res.set('Content-Length', uncompressedBuffer.byteLength.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(uncompressedBuffer);
  }

  intToByteArray = function (value) {
    var byteArray = [0, 0, 0, 0];

    for (var index = 0; index < byteArray.length; index++) {
      var byte = value & 0xff;
      byteArray[index] = byte;
      value = (value - byte) / 256;
    }

    return byteArray;
  };

//   @Post('/fileshare/:shareId/:slot')
//   @Header('Content-Type', 'image/jpeg')
//   @UseInterceptors(FileInterceptor('upload'))
//   async setFileshareScreenshot(
//     @Res({ passthrough: true }) res: Response,
//     @Param('shareId') shareId: string,
//     @Param('slot') slotNumber: string,
//     @UploadedFile() upload: Express.Multer.File,
//   ) {
//     const fileShare: FileShare = await this.queryBus.execute(
//       new GetFileshareQuery(1, null, new ShareID(shareId)),
//     );

//     if (!fileShare) throw new NotFoundException();

//     const slot = fileShare.getSlot(
//       new SlotNumber(parseInt(slotNumber.replace('.jpg', ''))),
//     );

//     if (slot.header.filetype != 13)
//       throw new BadRequestException('The provided file is not a screenshot.');

//     const compressedBuffer = slot.data;

//     const cmpLegth = this.swap32(
//       new Uint32Array(compressedBuffer.buffer.slice(0x2ac, 0x2b0))[0],
//     );

//     const uncompressedBuffer = Buffer.from(
//         inflate(compressedBuffer.buffer.slice(0x2b9, 0x2a8 + cmpLegth)).subarray(
//             16,
//         ),
//     );

//     const newCompressedImage = deflate(Buffer.concat([uncompressedBuffer.subarray(0, 0x10), upload.buffer]));
//     // const newBlf = Buffer.from([]);
//     // newBlf.

//     const newBlf = Buffer.concat([
//       compressedBuffer.subarray(0, 0x2ac), // blf header...
//       Buffer.from(this.intToByteArray(this.swap32(newCompressedImage.byteLength + 0x11))), // update _cmp size...
//       compressedBuffer.subarray(0x2b0, 0x2b9), // _cmp header...
//       newCompressedImage, // _cmp data
//       compressedBuffer.subarray(0x2a8 + cmpLegth, 0x2a8 + cmpLegth + 0x11), // blf footer.
//     ]);

//     slot.data = newBlf;

//     await this.commandBus.execute(new UploadFileCommand(new UserID(shareId), new ShareID(shareId), slot.slotNumber, slot.header, newBlf));

//     res.set('Content-Length', newBlf.byteLength.toString());
//     res.set('Cache-Control', 'no-cache');
//     return await this.getFileshareScreenshot(res, shareId, slotNumber);
//   }

//   @Post('/fileshare/:shareId/:slot')
//   @UseInterceptors(FileInterceptor('upload'))
//   async setFile(
//     @Res({ passthrough: true }) res: Response,
//     @Param('shareId') shareId: string,
//     @Param('slot') slotNumber: string,
//     @UploadedFile() upload: Express.Multer.File,
//   ) {
//     const fileShare: FileShare = await this.queryBus.execute(
//       new GetFileshareQuery(1, null, new ShareID(shareId)),
//     );

//     if (!fileShare) throw new NotFoundException();

//     const slot = fileShare.getSlot(
//       new SlotNumber(parseInt(slotNumber.replace('.jpg', ''))),
//     );

//     if (slot.header.filetype != 13)
//       throw new BadRequestException('The provided file is not a screenshot.');

//     const compressedBuffer = slot.data;

//     const cmpLegth = this.swap32(
//       new Uint32Array(compressedBuffer.buffer.slice(0x2ac, 0x2b0))[0],
//     );

//     const newCompressedImage = deflate(upload.buffer);
//     // const newBlf = Buffer.from([]);
//     // newBlf.

//     const newBlf = Buffer.concat([
//       compressedBuffer.subarray(0, 0x2ac), // blf header...
//       Buffer.from(this.intToByteArray(newCompressedImage.byteLength)), // update _cmp size...
//       compressedBuffer.subarray(0x2b0, 0x2b9), // _cmp header...
//       newCompressedImage, // _cmp data
//       compressedBuffer.slice(0x2a8 + cmpLegth, 11), // blf footer.
//     ]);

//     slot.data = newBlf;

//     await this.commandBus.execute(new UploadFileCommand(new UserID(shareId), new ShareID(shareId), slot.slotNumber, slot.header, newBlf));

//     res.set('Content-Length', newBlf.byteLength.toString());
//     res.set('Cache-Control', 'no-cache');
//     return await this.getFileshareScreenshot(res, shareId, slotNumber);
//   }

  @Post('/deflate')
  @UseInterceptors(FileInterceptor('upload'))
  async deflateUpload(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() upload: Express.Multer.File,
  ) {
    const deflated = deflate(upload.buffer);

    res.set('Content-Length', deflated.byteLength.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(deflated);
  }

  @Get('/screenshot/:filename')
  @Header('Content-Type', 'image/jpeg')
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') filename: string,
  ) {
    const path = join(process.cwd(), `uploads/screenshots`, filename);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    let screenshotBuffer = await readFile(path);

    const fileType = this.swap32(
      new Uint32Array(screenshotBuffer.buffer.slice(0xf8, 0xfc))[0],
    );

    if (fileType != 13)
      throw new BadRequestException('The provided file is not a screenshot.');

    screenshotBuffer = Buffer.from(screenshotBuffer.buffer.slice(0x2b8, -11));

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(screenshotBuffer);
  }
}
