import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFileshareQuery } from 'src/application/queries/GetFileshareQuery';
import UserID from 'src/domain/value-objects/UserId';
import ShareID from 'src/domain/value-objects/ShareId';
import Locale from 'src/domain/value-objects/Locale';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

const mapFileshareToResponse = (fileshare) => {
  return `QuoteBytes: ${fileshare.quotaBytes}
QuotaSlots: ${fileshare.quotaSlots}
SlotCount: ${fileshare.slotCount}
VisibleSlots: ${fileshare.visibleSlots}
SubscriptionHash: ${fileshare.subscriptionHash}
Message: ${fileshare.message}`;
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
  async startFileUpload() {
    return;
  }

  @Post('/FilesUpload.ashx')
  async uploadFile() {
    return;
  }

  @Post('/MachineUpdateNetworkStats.ashx')
  async machineUpdateNetworkStats() {
    return;
  }

  @Get('/UserUpdatePlayerStats.ashx')
  @ApiQuery({ name: 'title', type: 'number' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'highestSkill', type: 'number' })
  async userUpdatePlayerStats(
    @Query('title') titleID,
    @Query('userId') userID,
    @Query('highestSkill') highestSkil,
  ) {
    return;
  }
}
