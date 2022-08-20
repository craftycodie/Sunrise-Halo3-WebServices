import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import ContentHeader from '../../../domain/value-objects/ContentHeader';

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
  subscriptionHash: string;
}

export const FileShareSchema = SchemaFactory.createForClass(FileShare);
