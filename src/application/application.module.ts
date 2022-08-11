import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PersistanceModule } from 'src/infrastructure/persistance/persistance.module';
import { CreateFileShareCommandHandler } from './commandHandlers/CreateFileShareCommandHandler';
import { DeleteFileCommandHandler } from './commandHandlers/DeleteFileCommandHandler';
import { UploadFileCommandHandler } from './commandHandlers/UploadFileCommandHandler';
import { GetFileshareQueryHandler } from './queryHandlers/GetFileshareQueryHandler';

export const QueryHandlers = [GetFileshareQueryHandler];
export const CommandHandlers = [
  CreateFileShareCommandHandler,
  UploadFileCommandHandler,
  DeleteFileCommandHandler,
];

@Module({
  imports: [CqrsModule, PersistanceModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
