import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import FileShareSlot from 'src/domain/entities/FileShareSlot';
import IFileShareRepository, {
  IFileShareRepositorySymbol,
} from 'src/domain/repositories/IFileShareRepository';
import UniqueID from 'src/domain/value-objects/UniqueID';
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
    const fileShare = await this.repository.findByOwner(command.shareID);
    fileShare.uploadFile(
      FileShareSlot.create({
        slotNumber: command.slot,
        header: command.header,
        uniqueId: new UniqueID(command.header.uniqueId),
        data: command.file,
      }),
    );
    return await this.repository.save(fileShare);
  }
}
