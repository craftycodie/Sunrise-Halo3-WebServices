import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import {
  FileShareSlot,
  FileShareSlotDocument,
} from '../models/FileShareSlotSchema';
import IFileShareRepository from 'src/domain/repositories/IFileShareRepository';
import FileShare from 'src/domain/aggregates/FileShare';
import ShareID from 'src/domain/value-objects/ShareId';
import FileShareDomainMapper from '../mappers/FileShareDomainMapper';
import FileSharePersistanceMapper from '../mappers/FileSharePersistanceMapper';
import { FileShareDocument } from '../models/FileShareSchema';

@Injectable()
export default class FileShareRepository implements IFileShareRepository {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    @InjectModel(FileShare.name)
    private fileShareModel: Model<FileShareDocument>,
    @InjectModel(FileShareSlot.name)
    private fileShareSlotModel: Model<FileShareSlotDocument>,
    private readonly fileShareDomainMapper: FileShareDomainMapper,
    private readonly fileSharePersistanceMapper: FileSharePersistanceMapper,
  ) {}

  public async save(target: FileShare) {
    const fileShare = await this.fileShareModel.findOneAndUpdate(
      { id: target.id.value },
      this.fileSharePersistanceMapper.mapToDataModel(target).fileShare,
      { upsert: true },
    );

    const persistanceFiles =
      this.fileSharePersistanceMapper.mapToDataModel(target).files;

    const files: FileShareSlot[] = [];

    for (let i = 0; i < persistanceFiles.length; i++) {
      const file = persistanceFiles[i];
      console.log(file);

      const updatedFile = await this.fileShareSlotModel.findOneAndUpdate(
        { shareID: target.id.value },
        file,
        { upsert: true },
      );

      console.log(updatedFile)

      files.push(
        updatedFile
      );
    }

    console.log(files.map((file) => ({ uniqueId: file.uniqueId, slot: file.slotNumber})));

    await this.fileShareSlotModel.deleteMany({ uniqueId: { $nin: persistanceFiles.map(file => file.uniqueId) } })

    return this.fileShareDomainMapper.mapToDomainModel(fileShare, files);
  }

  public async find(id: ShareID) {
    const fileShare = await this.fileShareModel.findOne({ id: id.value });
    if (!fileShare) return;
    const files = await this.fileShareSlotModel.find({ shareId: id.value });
    return this.fileShareDomainMapper.mapToDomainModel(fileShare, files);
  }
}
