import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppLoggerMiddleware } from './AppLoggerMiddleware';
import { GameApiController } from './controllers/gameapi.controller';
import { JSONTitleStorageController } from './controllers/jsontitlestorage.controller';
import { MachineStorageController } from './controllers/machinestorage.controller';
import { PimpsController } from './controllers/pimps.controller';
import { SunriseController } from './controllers/sunrise.controller';
import { TitleStorageController } from './controllers/titlestorage.controller';
import { UploadServerController } from './controllers/uploadserver.controller';
import { UserStorageController } from './controllers/userstorage.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', '..', 'public'),
    }),
  ],
  controllers: [
    GameApiController,
    TitleStorageController,
    JSONTitleStorageController,
    UserStorageController,
    MachineStorageController,
    UploadServerController,
    SunriseController,
    PimpsController,
  ],
  providers: [],
})
export class PresentationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
