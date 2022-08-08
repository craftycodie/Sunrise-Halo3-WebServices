import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GameApiController } from './controllers/gameapi.controller';
import { MachineStorageController } from './controllers/machinestorage.controller';
import { TitleStorageController } from './controllers/titlestorage.controller';
import { UserStorageController } from './controllers/userstorage.controller';

@Module({
  imports: [CqrsModule],
  controllers: [
    GameApiController,
    TitleStorageController,
    UserStorageController,
    MachineStorageController,
  ],
  providers: [],
})
export class PresentationModule {}
