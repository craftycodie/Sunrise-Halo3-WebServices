import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
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
import Locale from 'src/domain/value-objects/Locale';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { readContentHeader } from '../blf/ContentHeader';
import FileShare from 'src/domain/aggregates/FileShare';
import { CreateFileShareCommand } from 'src/application/commands/CreateFileShareCommand';
import { UploadFileCommand } from 'src/application/commands/UploadFileCommand';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import FileShareSlot from 'src/domain/entities/FileShareSlot';
import { DeleteFileCommand } from 'src/application/commands/DeleteFileCommand';
import { UploadScreenshotCommand } from 'src/application/commands/UploadScreenshotCommand';

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
    case 1:
      return 'GameVariantCtf';
    case 2:
      return 'GameVariantSlayer';
    case 3:
      return 'GameVariantOddball';
    case 4:
      return 'GameVariantKing';
    case 5:
      return 'GameVariantJuggernaut';
    case 6:
      return 'GameVariantTerritories';
    case 7:
      return 'GameVariantAssault';
    case 8:
      return 'GameVariantInfection';
    case 9:
      return 'GameVariantVip';
    case 10:
      return 'MapVariant';
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
        new UserID(shareID),
        parseInt(titleID),
        new UserID(userID),
        new Locale(locale),
      ),
    );

    if (!fileshare)
      fileshare = await this.commandBus.execute(
        new CreateFileShareCommand(
          parseInt(titleID),
          new UserID(userID),
          new UserID(shareID),
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
      new GetFileshareQuery(new UserID(shareID), titleID, new UserID(userID)),
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

  uncuckBungieHeader(header: string) {
    return header.replace('"', '').replace('"', '');
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
        new UserID(this.uncuckBungieHeader(userid)),
        new UserID(this.uncuckBungieHeader(shareID)),
        new SlotNumber(parseInt(this.uncuckBungieHeader(slot))),
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
      new GetFileshareQuery(new UserID(shareID)),
    );

    if (!fileshare) throw new NotFoundException('File share not found.');

    return new StreamableFile(fileshare.getFileData(new SlotNumber(slot)));
  }

  // Screenshots are uploaded when they are taken apparently.
  @Post('/FilesUploadBlind.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadFileBlind(
    @Headers('title') titleID,
    @Headers('userid') userID,
    @Headers('gameid') gameID,
    @UploadedFile() upload: Express.Multer.File,
  ) {
    if (upload.originalname == 'screen.blf') {
      const contentHeader = readContentHeader(upload.buffer.slice(0x3c, 0x138));

      contentHeader.size = upload.size;

      if (Buffer.from(upload.buffer.slice(0x0, 0x4)).toString() != '_blf')
        throw new BadRequestException('Invalid file.');

      await this.commandBus.execute(
        new UploadScreenshotCommand(
          new UserID(this.uncuckBungieHeader(userID)),
          contentHeader,
          upload.buffer,
        ),
      );

      return upload.size;
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
        new UserID(shareID),
        new SlotNumber(slot),
      ),
    );
  }

  @Post('/MachineUpdateNetworkStats.ashx')
  @UseInterceptors(FileInterceptor('upload'))
  async machineUpdateNetworkStats(
    @Headers('title') titleID,
    @Headers('machineId') machineID,
    @UploadedFile() upload: Express.Multer.File,
  ) {
    await writeFile(
      join(
        process.cwd(),
        'uploads/machinenetworkstats',
        this.uncuckBungieHeader(machineID) + '.bin',
      ),
      upload.buffer,
    );
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
