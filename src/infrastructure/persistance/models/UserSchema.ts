import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ban, BanSchema } from './BanSchema';
import { PlayerData, PlayerDataSchema } from './PlayerDataSchema';
import { ServiceRecord } from './ServiceRecordSchema';
import { Transfer, TransferSchema } from './TransferSchema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  xuid: string;

  @Prop({ required: true, default: [], type: [BanSchema] })
  bans: Ban[];

  @Prop({ required: true, default: [], type: [TransferSchema] })
  transfers: Transfer[];

  @Prop({ required: true })
  serviceRecord: ServiceRecord;

  @Prop({ required: true, default: new PlayerData(), type: PlayerDataSchema })
  playerData: PlayerData;
}

export const UserSchema = SchemaFactory.createForClass(User);
