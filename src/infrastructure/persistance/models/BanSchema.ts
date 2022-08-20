import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BanDocument = Ban & Document;

@Schema()
export class Ban {
  @Prop({ required: true, unique: true, sparse: true })
  id: string;

  @Prop({ required: true })
  banType: number;

  @Prop({ required: true })
  banMessageIndex: number;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;
}

export const BanSchema = SchemaFactory.createForClass(Ban);
