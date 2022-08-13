import { Injectable } from '@nestjs/common';
import Screenshot from '../../../domain/aggregates/Screenshot';
import { Screenshot as ScreenshotModel } from '../models/ScreenshotSchema';

@Injectable()
export default class ScreenshotPersistanceMapper {
  public mapToDataModel(screenshot: Screenshot): ScreenshotModel {
    return {
      id: screenshot.id.value,
      userId: screenshot.userId.value,
      header: screenshot.header,
      data: screenshot.data,
      uniqueId: screenshot.header.uniqueId,
    };
  }
}
