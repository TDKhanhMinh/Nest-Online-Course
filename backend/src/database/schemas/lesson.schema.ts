import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LessonType } from '@shared/types/lesson-type.enum';

@Schema({ timestamps: true })
export class LessonDocument extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'SectionDocument' })
  sectionId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: LessonType })
  type: LessonType;

  @Prop()
  contentUrl?: string;

  @Prop({ type: String })
  textContent?: string;

  @Prop({ type: Number })
  duration?: number; // Duration in seconds

  @Prop({ required: true, type: Number })
  orderIndex: number;

  @Prop({ default: false })
  isFreePreview: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(LessonDocument);



