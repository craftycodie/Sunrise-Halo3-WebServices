import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceRecordDocument = ServiceRecord & Document;

@Schema()
export class ServiceRecord {
  @Prop({ required: true, unique: true, sparse: true })
  id: string;

  @Prop({ required: true })
  playerName: string; // includes gender
  @Prop({ required: true })
  appearanceFlags: number; // includes gender
  @Prop({ required: true })
  primaryColor: number;
  @Prop({ required: true })
  secondaryColor: number;
  @Prop({ required: true })
  tertiaryColor: number;
  @Prop({ required: true })
  model: number;
  @Prop({ required: true })
  foregroundEmblem: number;
  @Prop({ required: true })
  backgroundEmblem: number;
  @Prop({ required: true })
  emblemFlags: number; // Whether the secondary layer is shown or not.
  @Prop({ required: true })
  emblemPrimaryColor: number;
  @Prop({ required: true })
  emblemSecondaryColor: number;
  @Prop({ required: true })
  emblemBackgroundColor: number;
  @Prop({ required: true })
  spartanHelmet: number;
  @Prop({ required: true })
  spartanLeftShounder: number;
  @Prop({ required: true })
  spartanRightShoulder: number;
  @Prop({ required: true })
  spartanBody: number;
  @Prop({ required: true })
  eliteHelmet: number;
  @Prop({ required: true })
  eliteLeftShoulder: number;
  @Prop({ required: true })
  eliteRightShoulder: number;
  @Prop({ required: true })
  eliteBody: number;
  @Prop({ required: true })
  serviceTag: string; // wide, 5 characters long for some reason
  @Prop({ required: true })
  campaignProgress: number;
  @Prop({ required: true })
  highestSkill: number;
  @Prop({ required: true })
  totalEXP: number;
  @Prop({ required: true })
  unknownInsignia: number;
  @Prop({ required: true })
  rank: number;
  @Prop({ required: true })
  grade: number;
  @Prop({ required: true })
  unknownInsignia2: number;
}

export const ServiceRecordSchema = SchemaFactory.createForClass(ServiceRecord);
