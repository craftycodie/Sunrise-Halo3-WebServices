import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileShareSlot, FileShareSlotSchema } from './FileShareSlotSchema';

export type FileShareDocument = FileShare & Document;

@Schema()
export class FileShare {
  @Prop({ required: true, unique: true })
  id: string;
  @Prop({ required: true })
  ownerId: string;
  message: string;
  @Prop({ required: true })
  quotaBytes: number;
  @Prop({ required: true, default: 9 })
  quotaSlots: number;
  @Prop({ required: true, default: 9 })
  visibleSlots: number;
  @Prop({ required: true, default: 0 })
  subscriptionHash: number;
  @Prop({ required: true, default: [], type: [FileShareSlotSchema] })
  slots: FileShareSlot[];
}

export const FileShareSchema = SchemaFactory.createForClass(FileShare);
