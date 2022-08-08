import { Injectable } from '@nestjs/common';
import AbstractEnvSettings from '../../AbstractEnvSettings';
import { PresentationSettingsProps } from './IPresentationSettings';

@Injectable()
export default class PresentationSettings extends AbstractEnvSettings<PresentationSettingsProps> {
  public get() {
    return <PresentationSettingsProps>this.getFullConfig().presentation;
  }
}
