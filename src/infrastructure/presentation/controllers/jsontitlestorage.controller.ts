import {
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
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { stat } from 'fs/promises';
import { Response } from 'express';

@ApiTags('Title Storage (JSON)')
@Controller('/storage/title/:titleType/:titleId')
export class JSONTitleStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/:hoppersPath/dynamic_hopper_statistics.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @Header('Content-Type', 'application/json')
  async getHopperStats(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/dynamic_hopper_statistics.json`,
      res,
    );
  }

  @Get('/:hoppersPath/matchmaking_hopper_011.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @Header('Content-Type', 'application/json')
  async getHopperConfigurationTable(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/matchmaking_hopper_011.json`,
      res,
    );
  }

  @Get('/:hoppersPath/rsa_manifest.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @Header('Content-Type', 'application/json')
  async getRSAManifest(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/rsa_manifest.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMOTD(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd_popup.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMOTDPopup(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd_popup.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMythicMOTD(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd_popup.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMythicMOTDPopup(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_popup.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_tips.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMatchmakingTips(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_tips.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_hopper_descriptions_003.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMatchmakingHopperDescriptions(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_hopper_descriptions_003.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_banhammer_messages.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'application/json')
  async getMatchmakingBanhammerMessages(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_banhammer_messages.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/game_set_006.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @Header('Content-Type', 'application/json')
  async getGameSet(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/game_set_006.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/:variantName.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @ApiParam({ name: 'variantName', example: 'newbie_slayer_010' })
  @Header('Content-Type', 'application/json')
  async getGameVariant(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Param('variantName') variantName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/${variantName}.json`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/map_variants/:variantName.json')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @ApiParam({ name: 'variantName', example: 'ffa_snowbound_012' })
  @Header('Content-Type', 'application/json')
  async getMapVariant(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Param('variantName') variantName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/map_variants/${variantName}.json`,
      res,
    );
  }

  private async sendLocalFile(path: string, res: Response) {
    path = join(process.cwd(), `public/storage/title/`, path);

    const stats = await stat(path);

    if (!stats.isFile()) throw new NotFoundException();

    res.set('Content-Length', stats.size.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(createReadStream(path));
  }
}
