import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import IScreenshotRepository from 'src/domain/repositories/IScreenshotRepository';
import Screenshot from 'src/domain/aggregates/Screenshot';
import ScreenshotDomainMapper from '../mappers/ScreenshotDomainMapper';
import ScreenshotPersistanceMapper from '../mappers/ScreenshotPersistanceMapper';
import { ScreenshotDocument } from '../models/ScreenshotSchema';
import UserID from 'src/domain/value-objects/UserId';
import Uuid from 'src/domain/value-objects/Uuid';

@Injectable()
export default class ScreenshotRepository implements IScreenshotRepository {
  constructor(
    @Inject(ILoggerSymbol) private readonly logger: ILogger,
    @InjectModel(Screenshot.name)
    private screenshotModel: Model<ScreenshotDocument>,
    private readonly screenshotDomainMapper: ScreenshotDomainMapper,
    private readonly screenshotPersistanceMapper: ScreenshotPersistanceMapper,
  ) {}

  public async create(target: Screenshot) {
    const screenshot = await this.screenshotModel.create(
      this.screenshotPersistanceMapper.mapToDataModel(target),
    );

    return this.screenshotDomainMapper.mapToDomainModel(screenshot);
  }

  public async findByOwner(id: UserID) {
    const screenshots = await this.screenshotModel.find({ userId: id.value });

    return screenshots.map((screenshot) =>
      this.screenshotDomainMapper.mapToDomainModel(screenshot),
    );
  }

  public async find(id: Uuid) {
    const screenshot = await this.screenshotModel.findOne({ id: id.value });

    return this.screenshotDomainMapper.mapToDomainModel(screenshot);
  }

  public async getRecent() {
    const screenshots = await this.screenshotModel.find(undefined, undefined, {
      limit: 50,
    });

    return screenshots.map((screenshot) =>
      this.screenshotDomainMapper.mapToDomainModel(screenshot),
    );
  }
}
