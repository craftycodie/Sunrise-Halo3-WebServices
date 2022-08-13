import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Inject,
  Post,
  Query,
  StreamableFile,
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
import FileShare from 'src/domain/aggregates/FileShare';
import { CreateFileShareCommand } from 'src/application/commands/CreateFileShareCommand';
import { UploadFileCommand } from 'src/application/commands/UploadFileCommand';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import FileShareSlot from 'src/domain/entities/FileShareSlot';
import { DeleteFileCommand } from 'src/application/commands/DeleteFileCommand';

const mapFileshareToResponse = (fileshare: FileShare) => {
  return `QuotaBytes: ${fileshare.quotaBytes}
QuotaSlots: ${fileshare.quotaSlots}
SlotCount: ${fileshare.slots.length}
VisibleSlots: ${fileshare.visibleSlots}
SubscriptionHash: ${fileshare.subscriptionHash}
Message: ${fileshare.message ? fileshare.message : ''}
${fileshare.slots.map((slot) => mapFileShareSlotToResponse(slot)).join('')}
`;
};

const getFileTypeString = (fileType: number) => {
  switch (fileType) {
    case 2:
      return 'GameVariantSlayer';
    case 9:
      return 'GameVariantVip';
    case 11:
      return 'Film';
    case 12:
      return 'FilmClip';
    case 13:
      return 'Screenshot';
    default:
      return 'MapVariant';
  }
};

const mapFileShareSlotToResponse = (fileshareSlot: FileShareSlot) => {
  return `StartSlot: ${fileshareSlot.slotNumber.value}
  Guid: fake
  State: Ready
  Name: ${fileshareSlot.header.filename}
  Description: ${fileshareSlot.header.description}
  Author: ${fileshareSlot.header.author}
  AuthorXuid: ${fileshareSlot.header.authorXuid}
  AuthorXuidIsOnline: ${fileshareSlot.header.authorXuidIsOnline ? '1' : '0'}
  SizeBytes: ${fileshareSlot.header.size}
  FileType: ${getFileTypeString(fileshareSlot.header.filetype)}
  SecondsPast19700101: ${fileshareSlot.header.date}
  LengthSeconds: ${fileshareSlot.header.lengthSeconds}
  CampaignID: ${fileshareSlot.header.campaignId}
  MapID: ${fileshareSlot.header.mapId}
  GameEngineType: ${fileshareSlot.header.gameEngineType}
  CampaignDifficulty: ${fileshareSlot.header.campaignDifficulty}
  GameID: ${fileshareSlot.header.gameId}
EndSlot
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
  @ApiQuery({ name: 'title', type: 'number' })
  @ApiQuery({ name: 'shareId' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'locale' })
  async getFileshare(
    @Query('title') titleID,
    @Query('shareId') shareID,
    @Query('userId') userID,
    @Query('locale') locale,
  ) {
    let fileshare = await this.queryBus.execute(
      new GetFileshareQuery(
        parseInt(titleID),
        new UserID(userID),
        new ShareID(shareID),
        new Locale(locale),
      ),
    );

    if (!fileshare)
      fileshare = await this.commandBus.execute(
        new CreateFileShareCommand(
          parseInt(titleID),
          new UserID(userID),
          new ShareID(shareID),
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
    const fileShare: FileShare = await this.queryBus.execute(
      new GetFileshareQuery(titleID, new UserID(userID), new ShareID(shareID)),
    );
    return fileShare.getSlot(new SlotNumber(slot)).header.size;
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
  async uploadFile(
    @UploadedFile() upload: Express.Multer.File,
    @Headers('title') titleID,
    @Headers('userid') userid,
    @Headers('shareid') shareID,
    @Headers('slot') slot,
    @Headers('serverid') serverId,
  ) {
    const contentHeader = readContentHeader(upload.buffer.slice(0x3c, 0x138));

    contentHeader.size = upload.size;

    if (Buffer.from(upload.buffer.slice(0x0, 0x4)).toString() != '_blf')
      throw new BadRequestException('Invalid file.');

    await this.commandBus.execute(
      new UploadFileCommand(
        new UserID(userid.replace('"', '').replace('"', '')),
        new ShareID(shareID.replace('"', '').replace('"', '')),
        new SlotNumber(parseInt(slot.replace('"', '').replace('"', ''))),
        contentHeader,
        upload.buffer,
      ),
    );

    return upload.size;
  }

  @Get('/FilesDownload.ashx')
  async downloadFile(
    @Headers('title') titleID,
    @Query('userId') userid,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverid') serverId,
  ) {
    const fileshare: FileShare = await this.queryBus.execute(
      new GetFileshareQuery(1, new UserID(userid), new ShareID(shareID)),
    );

    return new StreamableFile(fileshare.getFileData(new SlotNumber(slot)));
  }

  // Screenshots are uploaded when they are taken apparently.
  @Post('/FilesUploadBlind.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadFileBlind(@UploadedFile() upload: Express.Multer.File) {
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
  async resumeDownloadFile() {
    return;
  }

  @Get('/FilesStageForDownload.ashx')
  async stageFileDownload(
    @Query('titleId') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverId') serverId,
    @Query('startPosition') startPosition,
    @Query('fromAutoQueue') fromAutoQueue,
    @Query('view') view,
  ) {
    return `Size: 1
FullSize: 1
InitialUrl: /gameapi/FilesDownload.ashx?userId=${userID}&shareId=${shareID}&slot=${slot}`;
  }

  @Get('/FilesDelete.ashx')
  async deleteFile(
    @Query('titleId') titleID,
    @Query('userId') userID,
    @Query('shareId') shareID,
    @Query('slot') slot,
    @Query('serverId') serverId,
  ) {
    return await this.commandBus.execute(
      new DeleteFileCommand(
        new UserID(userID),
        new ShareID(shareID),
        new SlotNumber(slot),
      ),
    );
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
