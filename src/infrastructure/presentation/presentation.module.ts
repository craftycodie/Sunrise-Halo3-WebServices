import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppLoggerMiddleware } from './AppLoggerMiddleware';
import { GameApiController } from './controllers/gameapi.controller';
import { MachineStorageController } from './controllers/machinestorage.controller';
import { TitleStorageController } from './controllers/titlestorage.controller';
import { UploadServerController } from './controllers/uploadserver.controller';
import { UserStorageController } from './controllers/userstorage.controller';

@Module({
  imports: [CqrsModule],
  controllers: [
    GameApiController,
    TitleStorageController,
    UserStorageController,
    MachineStorageController,
    UploadServerController,
  ],
  providers: [],
})
export class PresentationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
