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

@ApiTags('Title Storage')
@Controller('/storage/title/:titleType/:titleId')
export class TitleStorageController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/:hoppersPath/manifest_001.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getManifest(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/manifest_001.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/dynamic_hopper_statistics.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getHopperStats(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/dynamic_hopper_statistics.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/dynamic_matchmaking_nightmap.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @Header('Content-Type', 'image/jpeg')
  async getDynamicNightmap(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/dynamic_matchmaking_nightmap.jpg`,
      res,
    );
  }

  @Get('/:hoppersPath/matchmaking_hopper_011.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getHopperConfigurationTable(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/matchmaking_hopper_011.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/network_configuration_135.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getNetworkConfig(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/network_configuration_135.bin`,
      res,
    );
  }

  // TODO: Regex paths for version numbers.
  @Get('/:hoppersPath/network_configuration_125.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '11586' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getNetworkConfig125(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/network_configuration_125.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/rsa_manifest.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getRSAManifest(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/rsa_manifest.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMOTD(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd_popup.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMOTDPopup(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd_popup.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMythicMOTD(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd_popup.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMythicMOTDPopup(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_popup.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd_popup_image.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'image/jpeg')
  async getMOTDPopupImage(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd_popup_image.jpg`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd_popup_image.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'image/jpeg')
  async getMythicMOTDPopupImage(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_popup_image.jpg`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/motd_image.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'image/jpeg')
  async getMOTDImage(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/motd_image.jpg`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/blue_motd_image.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'image/jpeg')
  async getMythicMOTDImage(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_image.jpg`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_tips.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMatchmakingTips(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_tips.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_hopper_descriptions_003.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMatchmakingHopperDescriptions(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_hopper_descriptions_003.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:locale/matchmaking_banhammer_messages.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'locale', example: 'en' })
  async getMatchmakingBanhammerMessages(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_banhammer_messages.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/game_set_006.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  async getGameSet(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/game_set_006.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/:variantName.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @ApiParam({ name: 'variantName', example: 'newbie_slayer_010' })
  async getGameVariant(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Param('variantName') variantName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/${variantName}.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/map_variants/:variantName.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @ApiParam({ name: 'variantName', example: 'ffa_snowbound_012' })
  async getMapVariant(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Param('variantName') variantName: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/map_variants/${variantName}.bin`,
      res,
    );
  }

  @Get('/:hoppersPath/:hopperId/:locale/dynamic_matchmaking_histogram_01.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @ApiParam({ name: 'hopperId', example: '00101' })
  @ApiParam({ name: 'locale', example: 'en' })
  @Header('Content-Type', 'image/jpeg')
  async getMatchmakingHistogram(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
    @Param('hopperId') hopperId: string,
    @Param('locale') locale: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sendLocalFile(
      `${titleType}/${titleId}/${hoppersPath}/${hopperId}/${locale}/dynamic_matchmaking_histogram_01.jpg`,
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
