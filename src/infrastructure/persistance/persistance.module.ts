import { Module } from '@nestjs/common';
import PersistanceSettings from './settings/PersistanceSettings';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileShareSlot,
  FileShareSlotSchema,
} from './models/FileShareSlotSchema';
import { FileShare, FileShareSchema } from './models/FileShareSchema';
import { IFileShareRepositorySymbol } from 'src/domain/repositories/IFileShareRepository';
import FileShareRepository from './repositories/FileShareRepository';
import FileSharePersistanceMapper from './mappers/FileSharePersistanceMapper';
import FileShareDomainMapper from './mappers/FileShareDomainMapper';
import ScreenshotPersistanceMapper from './mappers/ScreenshotPersistanceMapper';
import ScreenshotDomainMapper from './mappers/ScreenshotDomainMapper';
import { IScreenshotRepositorySymbol } from 'src/domain/repositories/IScreenshotRepository';
import ScreenshotRepository from './repositories/ScreenshotRepository';
import { Screenshot, ScreenshotSchema } from './models/ScreenshotSchema';

const persistanceSettings = new PersistanceSettings().get();

@Module({
  imports: [
    MongooseModule.forRoot(persistanceSettings.mongoURI),
    MongooseModule.forFeature([
      { name: FileShare.name, schema: FileShareSchema },
      { name: FileShareSlot.name, schema: FileShareSlotSchema },

      { name: Screenshot.name, schema: ScreenshotSchema },
    ]),
  ],
  providers: [
    {
      provide: IFileShareRepositorySymbol,
      useClass: FileShareRepository,
    },
    FileSharePersistanceMapper,
    FileShareDomainMapper,

    {
      provide: IScreenshotRepositorySymbol,
      useClass: ScreenshotRepository,
    },
    ScreenshotPersistanceMapper,
    ScreenshotDomainMapper,
  ],
  exports: [IFileShareRepositorySymbol, IScreenshotRepositorySymbol],
})
export class PersistanceModule {}
