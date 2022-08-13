import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import ContentHeader from '../../../domain/value-objects/ContentHeader';

export type ScreenshotDocument = Screenshot & Document;

@Schema()
export class Screenshot {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  header: ContentHeader;

  @Prop({ required: true })
  data: Buffer;
}

export const ScreenshotSchema = SchemaFactory.createForClass(Screenshot);
ScreenshotSchema.index({ userId: 1, 'header.uniqueID': 1 }, { unique: true });
