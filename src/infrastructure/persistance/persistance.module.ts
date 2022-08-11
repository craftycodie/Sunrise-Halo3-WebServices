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

const persistanceSettings = new PersistanceSettings().get();

@Module({
  imports: [
    MongooseModule.forRoot(persistanceSettings.mongoURI),
    MongooseModule.forFeature([
      { name: FileShare.name, schema: FileShareSchema },
      { name: FileShareSlot.name, schema: FileShareSlotSchema },
    ]),
  ],
  providers: [
    {
      provide: IFileShareRepositorySymbol,
      useClass: FileShareRepository,
    },
    FileSharePersistanceMapper,
    FileShareDomainMapper,
  ],
  exports: [IFileShareRepositorySymbol],
})
export class PersistanceModule {}
