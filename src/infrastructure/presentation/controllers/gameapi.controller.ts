import {
  Controller,
  Get,
  Header,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFileshareQuery } from 'src/application/queries/GetFileshareQuery';
import UserID from 'src/domain/value-objects/UserId';
import ShareID from 'src/domain/value-objects/ShareId';
import Locale from 'src/domain/value-objects/Locale';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { readContentHeader } from '../blf/ContentHeader';

const mapFileshareToResponse = (fileshare) => {
  return `QuotaBytes: ${fileshare.quotaBytes}
QuotaSlots: ${fileshare.quotaSlots}
SlotCount: ${fileshare.slotCount}
VisibleSlots: ${fileshare.visibleSlots}
SubscriptionHash: ${fileshare.subscriptionHash}
Message: ${fileshare.message}
`;
};

@ApiTags('Game API')
@Controller('/gameapi')
export class GameApiController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/FilesGetCatalog.ashx')
  @ApiQuery({ name: 'titleId', type: 'number' })
  @ApiQuery({ name: 'shareId' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'locale' })
  async getFileshare(
    @Query('titleId') titleID,
    @Query('shareId') shareID,
    @Query('userId') userID,
    @Query('locale') locale,
  ) {
    const fileshare = await this.queryBus.execute(
      new GetFileshareQuery(
        parseInt(titleID),
        new UserID(userID),
        new ShareID(shareID),
        new Locale(locale),
      ),
    );

    return mapFileshareToResponse(fileshare);
  }

  @Get('/FilesNewUpload.ashx')
  async startFileUpload(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('uniqueId') uniqueID,
    @Query('fileType') fileType,
    @Query('uncompressedSize') uncompressedSize,
    @Query('compressedSize') compressedSize,
  ) {
    const serverId = 1;
    return serverId;
  }

  @Get('/FilesGetUploadProgress.ashx')
  async getUploadProgress(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverId') serverId,
  ) {
    const progress = 50;
    return progress;
  }

  @Get('/UserGetBnetSubscription.ashx')
  @ApiQuery({ name: 'titleId', type: 'number' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'locale' })
  async getBnetSubscription(
    @Query('titleId') titleID,
    @Query('userId') userID,
    @Query('locale') locale,
  ) {
    return 'Status: Subscribed';
  }

  @Post('/FilesUpload.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadFile(@UploadedFile() upload: Express.Multer.File) {
    console.log(upload);

    const contentHeader = readContentHeader(upload.buffer.slice(0x3c, 0x138));
    console.log(contentHeader);

    await writeFile(
      join(process.cwd(), 'uploads/fileshare', upload.originalname),
      upload.buffer,
    );
    return;
  }

  // Screenshots are uploaded when they are taken apparently.
  @Post('/FilesUploadBlind.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadFileBlind(@UploadedFile() upload: Express.Multer.File) {
    console.log(upload);
    if (upload.originalname == 'screen.blf') {
      await writeFile(
        join(process.cwd(), 'uploads', upload.originalname),
        upload.buffer,
      );

      await writeFile(
        join(
          process.cwd(),
          'uploads/screenshots',
          'screenshot_' + new Date().getTime().toString(),
        ),
        upload.buffer,
      );
      return;
    } else {
      await writeFile(
        join(process.cwd(), 'uploads/fileshare', upload.originalname),
        upload.buffer,
      );
      return;
    }
  }

  @Post('/FilesResumeDownload.ashx')
  async downloadFile() {
    return;
  }

  @Post('/FilesStageForDownload.ashx')
  async stageFileDownload(
    @Query('titleId') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverId') serverId,
  ) {
    return;
  }

  @Post('/FilesDelete.ashx')
  async deleteFile(
    @Query('titleId') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverId') serverId,
  ) {
    return;
  }

  @Post('/MachineUpdateNetworkStats.ashx')
  async machineUpdateNetworkStats(
    @Query('title') titleID,
    @Query('machineId') machineID,
  ) {
    return;
  }

  @Get('/UserUpdatePlayerStats.ashx')
  @ApiQuery({ name: 'title', type: 'number' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'highestSkill', type: 'number' })
  async userUpdatePlayerStats(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('highestSkill') highestSkill,
  ) {
    return;
  }

  @Get('/UserBeginConsume.ashx')
  @ApiQuery({ name: 'title', type: 'number' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'consumableId' })
  async userBeginConsume(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('consumableId') highestSkill,
  ) {
    return;
  }

  @Get('/UserCompleteConsume.ashx')
  @ApiQuery({ name: 'title', type: 'number' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'consumableId' })
  async userCompleteConsume(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('consumableId') highestSkill,
  ) {
    return;
  }
}
