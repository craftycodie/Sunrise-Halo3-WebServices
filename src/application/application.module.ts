import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PersistanceModule } from 'src/infrastructure/persistance/persistance.module';
import { CreateFileShareCommandHandler } from './commandHandlers/CreateFileShareCommandHandler';
import { DeleteFileCommandHandler } from './commandHandlers/DeleteFileCommandHandler';
import { UploadFileCommandHandler } from './commandHandlers/UploadFileCommandHandler';
import { UploadScreenshotCommandHandler } from './commandHandlers/UploadScreenshotCommandHandler';
import { GetPlayerScreenshotsQueryHandler } from './queryHandlers/GetPlayerScreenshotsQueryHandler';
import { GetScreenshotQueryHandler } from './queryHandlers/GetScreenshotQueryHandler';
import { GetFileshareQueryHandler } from './queryHandlers/GetFileshareQueryHandler';
import { GetUserQueryHandler } from './queryHandlers/GetUserQueryHandler';
import { CreateUserCommandHandler } from './commandHandlers/CreateUserCommandHandler';
import { UpdateServiceRecordCommandHandler } from './commandHandlers/UpdateServiceRecordCommandHandler';
import { GetPlayerXuidQueryHandler } from './queryHandlers/GetPlayerXuidQueryHandler';

export const QueryHandlers = [
  GetFileshareQueryHandler,
  GetScreenshotQueryHandler,
  GetPlayerScreenshotsQueryHandler,
  GetUserQueryHandler,
  GetPlayerXuidQueryHandler,
];
export const CommandHandlers = [
  CreateFileShareCommandHandler,
  UploadFileCommandHandler,
  DeleteFileCommandHandler,
  UploadScreenshotCommandHandler,
  CreateUserCommandHandler,
  UpdateServiceRecordCommandHandler,
];

@Module({
  imports: [CqrsModule, PersistanceModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
