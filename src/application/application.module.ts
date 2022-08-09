import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PersistanceModule } from 'src/infrastructure/persistance/persistance.module';
import { GetFileshareQueryHandler } from './queryHandlers/GetFileshareQueryHandler';

export const QueryHandlers = [GetFileshareQueryHandler];
export const CommandHandlers = [];

@Module({
  imports: [CqrsModule, PersistanceModule],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class ApplicationModule {}
