import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  StreamableFile,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Title Storage')
@Controller('/title/tracked/:titleType/:titleId')
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/manifest_001.bin`,
      ),
    );
    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/dynamic_hopper_statistics.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getHopperStats(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/dynamic_hopper_statistics.bin`,
      ),
    );
    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/dynamic_matchmaking_nightmap.jpg')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  @Header('Content-Type', 'image/jpeg')
  async getNightmap(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/dynamic_matchmaking_nightmap.jpg`,
      ),
    );

    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/matchmaking_hopper_011.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getHopperConfigurationTable(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/matchmaking_hopper_011.bin`,
      ),
    );
    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/network_configuration_135.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getNetworkConfig(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/network_configuration_135.bin`,
      ),
    );
    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/rsa_manifest.bin')
  @ApiParam({ name: 'titleType', example: 'tracked' })
  @ApiParam({ name: 'titleId', example: '12070' })
  @ApiParam({ name: 'hoppersPath', example: 'default_hoppers' })
  async getRSAManifest(
    @Param('titleType') titleType: string,
    @Param('titleId') titleId: string,
    @Param('hoppersPath') hoppersPath: string,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/rsa_manifest.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/motd.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/motd_popup.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_popup.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/motd_popup_image.jpg`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_popup_image.jpg`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/motd_image.jpg`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/blue_motd_image.jpg`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_tips.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_hopper_descriptions_003.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${locale}/matchmaking_banhammer_messages.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${hopperId}/game_set_006.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${hopperId}/${variantName}_010.bin`,
      ),
    );
    return new StreamableFile(file);
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${hopperId}/map_variants/${variantName}.bin`,
      ),
    );
    return new StreamableFile(file);
  }

  @Get('/:hoppersPath/:hopperId/:locale/dynamic_matchmaking_histogram_01.jpeg')
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
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `public/title/${titleType}/${titleId}/${hoppersPath}/${hopperId}/${locale}/dynamic_matchmaking_histogram_01.jpg`,
      ),
    );
    return new StreamableFile(file);
  }
}
