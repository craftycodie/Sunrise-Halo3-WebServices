import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransferDocument = Transfer & Document;

@Schema()
export class Transfer {
  @Prop({ required: true, unique: true, sparse: true })
  id: string;

  @Prop({ required: true })
  shareId: string;

  @Prop({ required: true })
  slot: number;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: number;

  @Prop()
  mapId: number;

  @Prop({ required: true })
  sizeBytes: number;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
