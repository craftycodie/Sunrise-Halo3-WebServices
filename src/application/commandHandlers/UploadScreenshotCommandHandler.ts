import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Screenshot from 'src/domain/aggregates/Screenshot';
import IScreenshotRepository, {
  IScreenshotRepositorySymbol,
} from 'src/domain/repositories/IScreenshotRepository';
import { UploadScreenshotCommand } from '../commands/UploadScreenshotCommand';

@CommandHandler(UploadScreenshotCommand)
export class UploadScreenshotCommandHandler
  implements ICommandHandler<UploadScreenshotCommand>
{
  constructor(
    @Inject(IScreenshotRepositorySymbol)
    private repository: IScreenshotRepository,
  ) {}

  async execute(command: UploadScreenshotCommand) {
    const screenshot = Screenshot.create({
      userId: command.userID,
      header: command.header,
      data: command.file,
    });
    return await this.repository.create(screenshot);
  }
}
