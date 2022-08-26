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
import { IUserRepositorySymbol } from 'src/domain/repositories/IUserRepository';
import { User, UserSchema } from './models/UserSchema';
import UserPersistanceMapper from './mappers/UserPersistanceMapper';
import UserDomainMapper from './mappers/UserDomainMapper';
import UserRepository from './repositories/UserRepository';

const persistanceSettings = new PersistanceSettings().get();

@Module({
  imports: [
    MongooseModule.forRoot(persistanceSettings.mongoURI),
    MongooseModule.forFeature([
      { name: FileShare.name, schema: FileShareSchema },

      { name: Screenshot.name, schema: ScreenshotSchema },

      { name: User.name, schema: UserSchema },
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

    {
      provide: IUserRepositorySymbol,
      useClass: UserRepository,
    },
    UserPersistanceMapper,
    UserDomainMapper,
  ],
  exports: [
    IFileShareRepositorySymbol,
    IScreenshotRepositorySymbol,
    IUserRepositorySymbol,
  ],
})
export class PersistanceModule {}
