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
import FileShareDomainMapper from '../mappers/FileShareDomainMapper';
import FileSharePersistanceMapper from '../mappers/FileSharePersistanceMapper';
import { FileShareDocument } from '../models/FileShareSchema';
import UserID from 'src/domain/value-objects/UserId';

@Injectable()
export default class FileShareRepository implements IFileShareRepository {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    @InjectModel(FileShare.name)
    private fileShareModel: Model<FileShareDocument>,
    private readonly fileShareDomainMapper: FileShareDomainMapper,
    private readonly fileSharePersistanceMapper: FileSharePersistanceMapper,
  ) {}

  public async save(target: FileShare) {
    const fileShare = await this.fileShareModel.findOneAndUpdate(
      { ownerId: target.ownerId.value },
      this.fileSharePersistanceMapper.mapToDataModel(target),
      { upsert: true, new: true },
    );

    return this.fileShareDomainMapper.mapToDomainModel(fileShare);
  }

  public async findByOwner(id: UserID) {
    const fileShare = await this.fileShareModel.findOne({ ownerId: id.value });
    if (!fileShare) return;
    return this.fileShareDomainMapper.mapToDomainModel(fileShare);
  }
}
