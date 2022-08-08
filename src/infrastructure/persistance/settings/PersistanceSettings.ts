import { Injectable } from '@nestjs/common';
import AbstractEnvSettings from '../../AbstractEnvSettings';
import { PersistanceSettingsProps } from './IPersistanceSettings';

@Injectable()
export default class PersistanceSettings extends AbstractEnvSettings<PersistanceSettingsProps> {
  public get() {
    return <PersistanceSettingsProps>this.getFullConfig().persistance;
  }
}
