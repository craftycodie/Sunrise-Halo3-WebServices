import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import IUserRepository from 'src/domain/repositories/IUserRepository';
import User from 'src/domain/aggregates/User';
import UserDomainMapper from '../mappers/UserDomainMapper';
import UserPersistanceMapper from '../mappers/UserPersistanceMapper';
import { UserDocument } from '../models/UserSchema';
import UserID from 'src/domain/value-objects/UserId';

@Injectable()
export default class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly userDomainMapper: UserDomainMapper,
    private readonly userPersistanceMapper: UserPersistanceMapper,
  ) {}

  public async findByXuid(xuid: UserID) {
    const user = await this.userModel.findOne({ xuid: xuid.value });
    if (!user) return;

    return this.userDomainMapper.mapToDomainModel(user);
  }

  public async findByGamertag(gamertag: string) {
    const user = await this.userModel.findOne({
      'serviceRecord.playerName': { '$regex': new RegExp(gamertag, 'i') },
    });
    if (!user) return;

    return this.userDomainMapper.mapToDomainModel(user);
  }

  public async save(target: User) {
    const user = await this.userModel.findOneAndUpdate(
      { id: target.id.value },
      this.userPersistanceMapper.mapToDataModel(target),
      { upsert: true, new: true },
    );

    return this.userDomainMapper.mapToDomainModel(user);
  }

  public async list(pageSize: number, pageNumber: number) {
    const users = await this.userModel.find({
      'serviceRecord.playerName': { $exists: true, $ne: '' },
    }, undefined, {
      limit: pageSize,
      skip: pageSize * (pageNumber - 1),
      sort: { createdAt: -1 },
    });

    return users.map((user) => this.userDomainMapper.mapToDomainModel(user));
  }
}
