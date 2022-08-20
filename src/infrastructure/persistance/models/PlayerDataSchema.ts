import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDataDocument = PlayerData & Document;

@Schema()
export class PlayerData {
  @Prop({ required: true, unique: true, sparse: true })
  id: string;

  @Prop({ required: true, default: 0 })
  hopperAccess: number;
  @Prop({ required: true, default: false })
  isBnetUser: boolean;
  @Prop({ required: true, default: false })
  isPro: boolean;
  @Prop({ required: true, default: false })
  isBungie: boolean;
  @Prop({ required: true, default: false })
  hasRecon: boolean;
  @Prop({ required: true, default: 'default_hoppers' })
  hopperDirectory: string;
}

export const PlayerDataSchema = SchemaFactory.createForClass(PlayerData);
