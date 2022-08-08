import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GameApiController } from './controllers/gameapi.controller';
import { TitleStorageController } from './controllers/titlestorage.controller';

@Module({
  imports: [CqrsModule],
  controllers: [GameApiController, TitleStorageController],
  providers: [],
})
export class PresentationModule {}
