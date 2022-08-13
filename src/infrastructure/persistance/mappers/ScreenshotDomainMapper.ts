import { Screenshot as ScreenshotModel } from '../models/ScreenshotSchema';
import Screenshot from '../../../domain/aggregates/Screenshot';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { Inject, Injectable } from '@nestjs/common';
import UserID from 'src/domain/value-objects/UserId';
import Uuid from 'src/domain/value-objects/Uuid';

@Injectable()
export default class ScreenshotDomainMapper {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILogger) {}

  public mapToDomainModel(screenshot: ScreenshotModel): Screenshot {
    const aggregateScreenshot = new Screenshot({
      id: Uuid.create(screenshot.id),
      userId: new UserID(screenshot.userId),
      header: screenshot.header,
      data: screenshot.data,
    });

    return aggregateScreenshot;
  }
}
