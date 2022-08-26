import { Injectable } from '@nestjs/common';
import FileShare from '../../../domain/aggregates/FileShare';
import { FileShare as FileShareModel } from '../models/FileShareSchema';

@Injectable()
export default class FileSharePersistanceMapper {
  public mapToDataModel(fileShare: FileShare): FileShareModel {
    return {
      id: fileShare.id.value,
      ownerId: fileShare.ownerId.value,
      message: fileShare.message,
      quotaBytes: fileShare.quotaBytes,
      quotaSlots: fileShare.quotaSlots,
      visibleSlots: fileShare.visibleSlots,
      subscriptionHash: fileShare.subscriptionHash,
      slots: fileShare.slots.map((file) => {
        return {
          id: file.id.value,
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
