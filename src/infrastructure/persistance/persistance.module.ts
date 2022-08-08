import { Module } from '@nestjs/common';
import PersistanceSettings from './settings/PersistanceSettings';

const persistanceSettings = new PersistanceSettings().get();

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class PersistanceModule {}
