import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import ContentHeader from '../../../domain/value-objects/ContentHeader';

export type FileShareSlotDocument = FileShareSlot & Document;

@Schema()
export class FileShareSlot {
  @Prop({ required: true })
  uniqueId: string;

  @Prop({ required: true })
  slotNumber: number;

  @Prop({ required: true })
  shareID: string;

  @Prop({ required: true, type: Object })
  header: ContentHeader;

  @Prop({ required: true })
  data: Buffer;
}

export const FileShareSlotSchema = SchemaFactory.createForClass(FileShareSlot);
