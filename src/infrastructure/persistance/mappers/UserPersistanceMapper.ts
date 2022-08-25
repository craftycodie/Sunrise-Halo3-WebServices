import { Injectable } from '@nestjs/common';
import User from '../../../domain/aggregates/User';
import { User as UserModel } from '../models/UserSchema';

@Injectable()
export default class UserPersistanceMapper {
  public mapToDataModel(user: User): UserModel {
    return {
      id: user.id.value,
      xuid: user.xuid.value,
      bans: user.bans.map((ban) => ({
        id: ban.id.value,
        banType: ban.banType,
        banMessageIndex: ban.banMessageIndex.value,
        startTime: ban.startTime,
        endTime: ban.endTime,
      })),
      transfers: user.transfers.map((transfer) => ({
        id: transfer.id.value,
        shareId: transfer.shareId.value,
        slot: transfer.slot.value,
        fileName: transfer.fileName,
        fileType: transfer.fileType,
        mapId: transfer.mapId,
        sizeBytes: transfer.sizeBytes,
      })),
      playerData: {
        id: user.playerData.id.value,
        hopperAccess: user.playerData.hopperAccess,
        hopperDirectory: user.playerData.hopperDirectory,
        isBnetUser: user.playerData.isBnetUser,
        isBungie: user.playerData.isBungie,
        isPro: user.playerData.isPro,
        hasRecon: user.playerData.hasRecon,
      },
      serviceRecord: {
        id: user.serviceRecord.id.value,
        playerName: user.serviceRecord.playerName,
        appearanceFlags: user.serviceRecord.appearanceFlags,
        primaryColor: user.serviceRecord.primaryColor,
        secondaryColor: user.serviceRecord.secondaryColor,
        tertiaryColor: user.serviceRecord.tertiaryColor,
        model: user.serviceRecord.model,
        foregroundEmblem: user.serviceRecord.foregroundEmblem,
        backgroundEmblem: user.serviceRecord.backgroundEmblem,
        emblemFlags: user.serviceRecord.emblemFlags,
        emblemPrimaryColor: user.serviceRecord.emblemPrimaryColor,
        emblemSecondaryColor: user.serviceRecord.emblemSecondaryColor,
        emblemBackgroundColor: user.serviceRecord.emblemBackgroundColor,
        spartanHelmet: user.serviceRecord.spartanHelmet,
        spartanLeftShounder: user.serviceRecord.spartanLeftShounder,
        spartanRightShoulder: user.serviceRecord.spartanRightShoulder,
        spartanBody: user.serviceRecord.spartanBody,
        eliteHelmet: user.serviceRecord.eliteHelmet,
        eliteLeftShoulder: user.serviceRecord.eliteLeftShoulder,
        eliteRightShoulder: user.serviceRecord.eliteRightShoulder,
        eliteBody: user.serviceRecord.eliteBody,
        serviceTag: user.serviceRecord.serviceTag,
        campaignProgress: user.serviceRecord.campaignProgress,
        highestSkill: user.serviceRecord.highestSkill,
        totalEXP: user.serviceRecord.totalEXP,
        unknownInsignia: user.serviceRecord.unknownInsignia,
        rank: user.serviceRecord.rank,
        grade: user.serviceRecord.grade,
        unknownInsignia2: user.serviceRecord.unknownInsignia2,
      },
    };
  }
}
