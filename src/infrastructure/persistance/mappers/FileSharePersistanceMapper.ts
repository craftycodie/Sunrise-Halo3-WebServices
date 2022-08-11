import { Injectable } from '@nestjs/common';
import FileShare from '../../../domain/aggregates/FileShare';
import { FileShare as FileShareModel } from '../models/FileShareSchema';
import { FileShareSlot as FileModel } from '../models/FileShareSlotSchema';

@Injectable()
export default class FileSharePersistanceMapper {
  public mapToDataModel(fileShare: FileShare): {
    fileShare: FileShareModel;
    files: FileModel[];
  } {
    return {
      fileShare: {
        id: fileShare.id.value,
        userID: fileShare.userID.value,
        message: fileShare.message,
        quotaBytes: fileShare.quotaBytes,
        quotaSlots: fileShare.quotaSlots,
        visibleSlots: fileShare.visibleSlots,
        subscriptionHash: fileShare.subscriptionHash,
      },
      files: fileShare.slots.map((file) => {
        return {
          shareID: fileShare.id.value,
          slotNumber: file.slotNumber.value,
          data: file.data,
          header: file.header,
          uniqueId: file.uniqueId.value,
        };
      }),
    };
  }
}
