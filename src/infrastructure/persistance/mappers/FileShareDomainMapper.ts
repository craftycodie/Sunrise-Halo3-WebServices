import { FileShare as FileShareModel } from '../models/FileShareSchema';
import FileShare from '../../../domain/aggregates/FileShare';
import { FileShareSlot as FileModel } from '../models/FileShareSlotSchema';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import FileShareSlot from '../../../domain/entities/FileShareSlot';
import { Inject, Injectable } from '@nestjs/common';
import ShareID from 'src/domain/value-objects/ShareId';
import UserID from 'src/domain/value-objects/UserId';
import GameID from 'src/domain/value-objects/GameID';
import UniqueID from 'src/domain/value-objects/UniqueID';
import SlotNumber from 'src/domain/value-objects/SlotNumber';

@Injectable()
export default class FileShareDomainMapper {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILogger) {}

  public mapToDomainModel(
    fileShare: FileShareModel,
    files: (FileModel | undefined)[],
  ): FileShare {
    const mappedFiles: FileShareSlot[] = files.map((file) =>
      file == undefined
        ? undefined
        : new FileShareSlot({
            uniqueId: new UniqueID(file.uniqueId),
            slotNumber: new SlotNumber(file.slotNumber),
            data: file.data,
            header: file.header,
          }),
    );

    const aggregateAlbum = new FileShare({
      id: new ShareID(fileShare.id),
      userID: new UserID(fileShare.userID),
      message: fileShare.message,
      visibleSlots: fileShare.visibleSlots,
      quotaBytes: fileShare.quotaBytes,
      quotaSlots: fileShare.quotaSlots,
      subscriptionHash: fileShare.subscriptionHash,
      slots: mappedFiles,
    });

    return aggregateAlbum;
  }
}
