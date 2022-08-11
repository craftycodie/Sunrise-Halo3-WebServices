import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import FileShare from 'src/domain/aggregates/FileShare';
import FileShareSlot from 'src/domain/entities/FileShareSlot';
import IFileShareRepository, {
  IFileShareRepositorySymbol,
} from 'src/domain/repositories/IFileShareRepository';
import SlotNumber from 'src/domain/value-objects/SlotNumber';
import UniqueID from 'src/domain/value-objects/UniqueID';
import { CreateFileShareCommand } from '../commands/CreateFileShareCommand';
import { UploadFileCommand } from '../commands/UploadFileCommand';

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(
    @Inject(IFileShareRepositorySymbol)
    private repository: IFileShareRepository,
  ) {}

  async execute(command: UploadFileCommand) {
    const fileShare = await this.repository.find(command.shareID);
    fileShare.uploadFile(
      FileShareSlot.create({
        slotNumber: command.slot,
        header: command.header,
        uniqueId: new UniqueID(''),
        data: command.file,
      }),
    );
    return await this.repository.save(fileShare);
  }
}
