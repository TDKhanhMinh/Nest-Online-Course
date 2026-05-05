import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum LectureType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
}

@Schema({ timestamps: true })
export class LectureDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'SectionDocument' })
  sectionId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: LectureType })
  type: LectureType;

  @Prop()
  contentUrl: string;

  @Prop({ default: 0 })
  durationSeconds: number;

  @Prop({ required: true })
  orderIndex: number;

  @Prop({ default: false })
  isPreview: boolean;
}

export const LectureSchema = SchemaFactory.createForClass(LectureDocument);
