import { User as UserModel } from '../models/UserSchema';
import { ServiceRecord as ServiceRecordModel } from '../models/ServiceRecordSchema';
import { Ban as BanModel } from '../models/BanSchema';
import { Transfer as TransferModel } from '../models/TransferSchema';
import { PlayerData as PlayerDataModel } from '../models/PlayerDataSchema';
import User from '../../../domain/aggregates/User';
import ILogger, { ILoggerSymbol } from '../../../ILogger';
import { Inject, Injectable } from '@nestjs/common';
import UserID from 'src/domain/value-objects/UserId';
import Uuid from 'src/domain/value-objects/Uuid';
import ServiceRecord from 'src/domain/entities/ServiceRecord';
import PlayerData from 'src/domain/entities/PlayerData';
import Ban from 'src/domain/entities/Ban';
import BanMessageIndex from 'src/domain/value-objects/BanMessageIndex';
import Transfer from 'src/domain/entities/Transfer';
import SlotNumber from 'src/domain/value-objects/SlotNumber';

@Injectable()
export default class UserDomainMapper {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILogger) {}

  public mapToDomainModel(user: UserModel): User {
    const aggregateUser = new User({
      id: Uuid.create(user.id),
      xuid: new UserID(user.xuid),
      serviceRecord: this.mapServiceRecord(user.serviceRecord),
      playerData: this.mapPlayerData(user.playerData),
      bans: this.mapBans(user.bans),
      transfers: this.mapTransfers(user.transfers),
    });

    return aggregateUser;
  }

  private mapTransfers(transfers: TransferModel[]): Transfer[] {
    return transfers.map((transferModel) => {
      return new Transfer({
        id: new Uuid(transferModel.id),
        shareId: new UserID(transferModel.shareId),
        slot: new SlotNumber(transferModel.slot),
        fileName: transferModel.fileName,
        fileType: transferModel.fileType,
        mapId: transferModel.mapId,
        sizeBytes: transferModel.sizeBytes,
      });
    });
  }

  private mapBans(bans: BanModel[]): Ban[] {
    return bans.map((banModel) => {
      return new Ban({
        id: new Uuid(banModel.id),
        banType: banModel.banType,
        banMessageIndex: new BanMessageIndex(banModel.banMessageIndex),
        startTime: banModel.startTime,
        endTime: banModel.endTime,
      });
    });
  }

  private mapPlayerData(playerData: PlayerDataModel): PlayerData {
    return new PlayerData({
      id: new Uuid(playerData.id),
      hopperAccess: playerData.hopperAccess,
      isBnetUser: playerData.isBnetUser,
      isBungie: playerData.isBungie,
      isPro: playerData.isPro,
      hasRecon: playerData.hasRecon,
      hopperDirectory: playerData.hopperDirectory,
    });
  }

  private mapServiceRecord(serviceRecord: ServiceRecordModel): ServiceRecord {
    return new ServiceRecord({
      id: new Uuid(serviceRecord.id),
      playerName: serviceRecord.playerName,
      appearanceFlags: serviceRecord.appearanceFlags,
      primaryColor: serviceRecord.primaryColor,
      secondaryColor: serviceRecord.secondaryColor,
      tertiaryColor: serviceRecord.tertiaryColor,
      model: serviceRecord.model,
      foregroundEmblem: serviceRecord.foregroundEmblem,
      backgroundEmblem: serviceRecord.backgroundEmblem,
      emblemFlags: serviceRecord.emblemFlags,
      emblemPrimaryColor: serviceRecord.emblemPrimaryColor,
      emblemSecondaryColor: serviceRecord.emblemSecondaryColor,
      emblemBackgroundColor: serviceRecord.emblemBackgroundColor,
      spartanHelmet: serviceRecord.spartanHelmet,
      spartanLeftShounder: serviceRecord.spartanLeftShounder,
      spartanRightShoulder: serviceRecord.spartanRightShoulder,
      spartanBody: serviceRecord.spartanBody,
      eliteHelmet: serviceRecord.eliteHelmet,
      eliteLeftShoulder: serviceRecord.eliteLeftShoulder,
      eliteRightShoulder: serviceRecord.eliteRightShoulder,
      eliteBody: serviceRecord.eliteBody,
      serviceTag: serviceRecord.serviceTag,
      campaignProgress: serviceRecord.campaignProgress,
      highestSkill: serviceRecord.highestSkill,
      totalEXP: serviceRecord.totalEXP,
      unknownInsignia: serviceRecord.unknownInsignia,
      rank: serviceRecord.rank,
      grade: serviceRecord.grade,
      unknownInsignia2: serviceRecord.unknownInsignia2,
    });
  }
}
