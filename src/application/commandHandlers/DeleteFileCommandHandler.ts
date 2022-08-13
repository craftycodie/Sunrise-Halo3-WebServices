import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import IFileShareRepository, {
  IFileShareRepositorySymbol,
} from 'src/domain/repositories/IFileShareRepository';
import { DeleteFileCommand } from '../commands/DeleteFileCommand';

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler
  implements ICommandHandler<DeleteFileCommand>
{
  constructor(
    @Inject(IFileShareRepositorySymbol)
    private repository: IFileShareRepository,
  ) {}

  async execute(command: DeleteFileCommand) {
    const fileShare = await this.repository.findByOwner(command.shareID);
    fileShare.deleteFile(command.slot);
    return await this.repository.save(fileShare);
  }
}
