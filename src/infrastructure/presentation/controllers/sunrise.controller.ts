import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { Response } from 'express';
import { deflate, inflate } from 'pako';
import { GetFileshareQuery } from 'src/application/queries/GetFileshareQuery';
import FileShare from 'src/domain/aggregates/FileShare';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import { FileInterceptor } from '@nestjs/platform-express';
import UserID from 'src/domain/value-objects/UserId';
import { GetPlayerScreenshotsQuery } from 'src/application/queries/GetPlayerScreenshotsQuery';
import Screenshot from 'src/domain/aggregates/Screenshot';
import { GetScreenshotQuery } from 'src/application/queries/GetScreenshotQuery';
import Uuid from 'src/domain/value-objects/Uuid';
import HopperConfigurationTableFile from '../types/HopperConfigurationTableFile';
import HopperDescriptionsFile from '../types/HopperDescriptionsFile';
import GameSetFile from '../types/GameSetFile';
import MapVariantFile from '../types/MapVariantFile';
import { statSync } from 'fs';
import GameVariantFile from '../types/GameVariantFile';
import { GetUserQuery } from 'src/application/queries/GetUserQuery';
import { GetPlayerXuidQuery } from 'src/application/queries/GetPlayerXuidQuery';

@ApiTags('Sunrise')
@Controller('/sunrise')
export class SunriseController {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  swap32(val) {
    return (
      ((val & 0xff) << 24) |
      ((val & 0xff00) << 8) |
      ((val >> 8) & 0xff00) |
      ((val >> 24) & 0xff)
    );
  }

  @Get('/player/:gamertag/fileshare/:slot')
  @Header('Content-Type', 'image/jpg')
  @ApiParam({ name: 'gamertag', example: '000901FC3FB8FE71' })
  async getFileshareScreenshot(
    @Res({ passthrough: true }) res: Response,
    @Param('gamertag') gamertag: string,
    @Param('slot') slotNumber: string,
  ) {
    const xuid = await this.queryBus.execute(new GetPlayerXuidQuery(gamertag));

    const fileShare: FileShare = await this.queryBus.execute(
      new GetFileshareQuery(xuid),
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

  @Get('/screenshot/:id')
  @Header('Content-Type', 'image/jpg')
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    id = id.replace('.jpg', '');
    const screenshot: Screenshot | undefined = await this.queryBus.execute(
      new GetScreenshotQuery(Uuid.create(id.toString())),
    );

    if (screenshot == undefined) throw new NotFoundException();

    let screenshotBuffer = screenshot.data;

    const fileType = this.swap32(
      new Uint32Array(screenshotBuffer.buffer.slice(0xf8, 0xfc))[0],
    );

    if (fileType != 13)
      throw new BadRequestException('The provided file is not a screenshot.');

    screenshotBuffer = Buffer.from(screenshotBuffer.buffer.slice(0x2b8, -11));

    res.set('Content-Length', screenshotBuffer.byteLength.toString());
    res.set('Cache-Control', 'no-cache');
    return new StreamableFile(screenshotBuffer);
  }

  async readJsonFile(path) {
    const file = await readFile(path, 'utf8');
    return JSON.parse(file);
  }

  private manifestModified: number;
  private playlistsJson: any;

  @Get('/online/playlists')
  async playlists(): Promise<any> {
    const stat = statSync(
      './public/storage/title/tracked/12070/default_hoppers/manifest_001.bin',
    );
    if (stat.mtime.getTime() != this.manifestModified) {
      const hoppersFile: HopperConfigurationTableFile = await this.readJsonFile(
        './public/storage/title/tracked/12070/default_hoppers/matchmaking_hopper_011.json',
      );

      const descriptionsFile: HopperDescriptionsFile = await this.readJsonFile(
        './public/storage/title/tracked/12070/default_hoppers/en/matchmaking_hopper_descriptions_003.json',
      );

      descriptionsFile.mhdf.descriptions.map((description) => {
        if (description.identifier < 100) {
          const categoryIndex = hoppersFile.mhcf.categories.findIndex(
            (category) => category.identifier == description.identifier,
          );
          if (categoryIndex != -1)
            hoppersFile.mhcf.categories[categoryIndex]['description'] =
              description.description;
        } else {
          const configurationIndexIndex =
            hoppersFile.mhcf.configurations.findIndex(
              (configuration) =>
                configuration.identifier == description.identifier,
            );
          if (configurationIndexIndex != -1)
            hoppersFile.mhcf.configurations[configurationIndexIndex][
              'description'
            ] = description.description;
        }
      });

      const gameSets = {};

      await Promise.all(
        hoppersFile.mhcf.configurations.map((configuration) => {
          return (async () => {
            const gameSet: GameSetFile = await this.readJsonFile(
              `./public/storage/title/tracked/12070/default_hoppers/${String(
                configuration.identifier,
              ).padStart(5, '0')}/game_set_006.json`,
            );

            await Promise.all(
              gameSet.gset.gameEntries.map((gameEntry) => {
                return (async () => {
                  const mapVariant: MapVariantFile = await this.readJsonFile(
                    `./public/storage/title/tracked/12070/default_hoppers/${String(
                      configuration.identifier,
                    ).padStart(5, '0')}/map_variants/${
                      gameEntry.mapVariantFileName.toLowerCase()
                    }_012.json`,
                  );

                  const gameVariant: GameVariantFile = await this.readJsonFile(
                    `./public/storage/title/tracked/12070/default_hoppers/${String(
                      configuration.identifier,
                    ).padStart(5, '0')}/${
                      gameEntry.gameVariantFileName.toLowerCase()
                    }_010.json`,
                  );

                  gameEntry['mapVariant'] = {
                    metadata: mapVariant.mvar.metadata,
                  };
                  gameEntry['gameVariant'] = Object.values(gameVariant.gvar)[0];
                })();
              }),
            );

            gameSets[configuration.identifier] = gameSet.gset;
          })();
        }),
      );

      const hoppers = hoppersFile.mhcf.configurations.map((configuration) => ({
        ...configuration,
        gameEntries: gameSets[configuration.identifier].gameEntries,
      }));

      this.manifestModified = stat.mtime.getTime();

      this.playlistsJson = [];

      let categories: any[] = [
        {
          identifier: 0,
          name: 'Ranked',
          description: '',
        },
        {
          identifier: 1,
          name: 'Social',
          description: '',
        },
        {
          identifier: 3,
          name: 'Basic Training',
          description: '',
        },
        {
          identifier: 4,
          name: 'Community Playlists',
          description: '',
        }
      ];

      categories = [...categories, ...hoppersFile.mhcf.categories];

      this.playlistsJson = categories.map((category) => {
        const categoryHoppers = hoppers.filter(
          (hopper) => hopper.category == category.identifier,
        );
        return {
          ...category,
          hoppers: categoryHoppers,
        };
      });
    }

    return this.playlistsJson;
  }

  @Get('/player/:gamertag/fileshare')
  @ApiParam({ name: 'gamertag', example: 'craftycodie' })
  async getFileshare(@Param('gamertag') gamertag) {
    const xuid = await this.queryBus.execute(new GetPlayerXuidQuery(gamertag));

    if (!xuid) throw new NotFoundException();

    const fileshare = await this.queryBus.execute(new GetFileshareQuery(xuid));

    return {
      ...fileshare,
      slots: fileshare.slots.map((slot) => ({
        ...slot,
        data: undefined,
      })),
    };
  }

  @Get('/player/:gamertag/servicerecord')
  @ApiParam({ name: 'gamertag', example: 'craftycodie' })
  async getServiceRecord(@Param('gamertag') gamertag) {
    const xuid = await this.queryBus.execute(new GetPlayerXuidQuery(gamertag));

    if (!xuid) throw new NotFoundException();

    return (await this.queryBus.execute(new GetUserQuery(xuid))).serviceRecord;
  }

  @Get('/player/:gamertag/screenshots')
  @ApiParam({ name: 'gamertag', example: 'craftycodie' })
  async getScreenshots(@Param('gamertag') gamertag) {
    const xuid = await this.queryBus.execute(new GetPlayerXuidQuery(gamertag));

    if (!xuid) throw new NotFoundException();

    return (
      await this.queryBus.execute(new GetPlayerScreenshotsQuery(xuid))
    ).map((screenshot) => ({
      ...screenshot,
      data: undefined,
    }));
  }
}
