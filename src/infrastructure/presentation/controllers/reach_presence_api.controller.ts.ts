import { Controller, Post, HttpCode, Res } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { StreamableFile } from '@nestjs/common/file-stream';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';

@ApiTags('Reach Presence API')
@Controller('/ReachPresenceApi/')
export class ReachPresenceApiController {
  @HttpCode(200)
  @Post('/heartbeat.ashx')
  async postPresence(@Res() res) {
    return await this.sendLocalFile(`heartbeat.bin`, res);
  }

  private async sendLocalFile(path: string, res: Response) {
    path = join(process.cwd(), `public/storage/heartbeat/`, path);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(createReadStream(path));
  }
}
