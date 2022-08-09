import { Module, Global, ConsoleLogger } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { ILoggerSymbol } from './ILogger';
import { PersistanceModule } from './infrastructure/persistance/persistance.module';
import { PresentationModule } from './infrastructure/presentation/presentation.module';

@Global()
@Module({
  imports: [
    ApplicationModule,
    DomainModule,
    PersistanceModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [{ provide: ILoggerSymbol, useClass: ConsoleLogger }],
  exports: [ILoggerSymbol],
})
export class SunriseModule {}
